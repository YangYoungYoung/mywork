package com.xyt.webviewtest;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

@SuppressLint("SetJavaScriptEnabled")
public class MainActivity extends Activity {
	private WebView webview;
	public static final int SHOW_RESPONSE = 0;
	private String url = ":8082/admin/app";
	private String font = "http://";
	// private String testUrl = "http://192.168.0.6:8082/admin/app/";
	private ProgressBar progressBar;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Window window = getWindow();
		// ���ر�����
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		// ����״̬��
		// ����ȫ������
		// int flag=WindowManager.LayoutParams.FLAG_FULLSCREEN;
		// //���õ�ǰ����Ϊȫ����ʾ
		// window.setFlags(flag, flag);

		setContentView(R.layout.activity_main);
		// ����һ��sharedpreferences
		webview = (WebView) findViewById(R.id.webView);
		progressBar = (ProgressBar) findViewById(R.id.pb);

		webview.reload(); // ˢ��

		// ����WebSettings����
		WebSettings webSettings = webview.getSettings();

		// ���� ����ģʽ����ʹ�û���
		webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
		// ���� DOM storage API ����
		webSettings.setDomStorageEnabled(true);
		// ������ʵ�ҳ����Ҫ��Javascript��������webview��������֧��Javascript
		webSettings.setJavaScriptCanOpenWindowsAutomatically(true);// js��android����
		webSettings.setDomStorageEnabled(true);// ֧��DOM API
		webSettings.setJavaScriptEnabled(true);
		webSettings.setAppCacheEnabled(true); // ����H5�Ļ����,Ĭ�Ϲر�
		// ��������Ӧ��Ļ�����ߺ���
		webSettings.setUseWideViewPort(true); // ��ͼƬ�������ʺ�webview�Ĵ�С
		webSettings.setLoadWithOverviewMode(true); // ��������Ļ�Ĵ�С
		webSettings
				.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);// ���ã����ܵĻ�ʹ�����еĿ��Ȳ�������Ļ����
		// ���Ų���
		webSettings.setSupportZoom(false); // ֧�����ţ�Ĭ��Ϊtrue���������Ǹ���ǰ�ᡣ
		webSettings.setBuiltInZoomControls(false); // �������õ����ſؼ�����Ϊfalse�����WebView��������
		// webSettings.setDisplayZoomControls(false); // ����ԭ�������ſؼ�
		// ����ϸ�ڲ���
		webSettings.setAllowFileAccess(true); // ���ÿ��Է����ļ�
		webSettings.setLoadsImagesAutomatically(true); // ֧���Զ�����ͼƬ
		webSettings.setDefaultTextEncodingName("utf-8");// ���ñ����ʽ
		// webSettings.setDatabaseEnabled(true);

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
			webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
		}

		if (Build.VERSION.SDK_INT >= 19) {
			webview.getSettings().setLoadsImagesAutomatically(true);
		} else {
			webview.getSettings().setLoadsImagesAutomatically(false);
		}
		sendRequestWithHttpClient();
	}

	/****
	 * 
	 * Handler����ƴ�Ӻõ�����
	 */
	private Handler handler = new Handler() {

		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case SHOW_RESPONSE:
				String response = (String) msg.obj;
				font += response + url;

				// ����WebChromeClient��
				webview.setWebChromeClient(new webChromeClient());
				// ���ò���ϵͳ�������,ֱ����ʾ�ڵ�ǰWebview
				webview.setWebViewClient(new WebViewClient() {
					@Override
					public void onPageStarted(WebView view, String url,
							Bitmap favicon) {
						super.onPageStarted(view, url, favicon);
					}

					@Override
					public void onPageFinished(WebView view, String url) {
						super.onPageFinished(view, url);
						if(!webview.getSettings().getLoadsImagesAutomatically()) {
					        webview.getSettings().setLoadsImagesAutomatically(true);
					    }
					}

					@Override
					public boolean shouldOverrideUrlLoading(WebView view,
							String url) {
						view.loadUrl(url);
						return true;
					}

					@Override
					public void onReceivedSslError(WebView view,
							SslErrorHandler handler, SslError error) {
						// ��Ҫʹ��super��������Щ�ֻ����ʲ��ˣ���Ϊ������һ�� handler.cancel()
						// super.onReceivedSslError(view, handler, error);
						// ����������վ��֤�飬����SSL����ִ�з�����ҳ
						handler.proceed();
					}
				});
				webview.loadUrl(font);
				Log.e("ƴ�Ӻõ�URL��------------------", font);
				break;

			default:
				break;
			}
		}
	};

	private class webChromeClient extends WebChromeClient {
		@Override
		public void onProgressChanged(WebView view, int newProgress) {
			progressBar.setProgress(newProgress);
			if (newProgress == 100) {
				progressBar.setVisibility(View.GONE);
			} else {
				progressBar.setVisibility(View.VISIBLE);
				// progressBar.setProgress(newProgress);
			}
			super.onProgressChanged(view, newProgress);
		}
	}

	/***
	 * 
	 * �߳̽�����������
	 * 
	 */
	private void sendRequestWithHttpClient() {
		new Thread(new Runnable() {

			@Override
			public void run() {
				// ��HttpClient�������󣬷�Ϊ�岽
				// ��һ��������HttpClient����
				HttpClient httpCient = new DefaultHttpClient();
				// �ڶ�����������������Ķ���,�����Ƿ��ʵķ�������ַ
				HttpGet httpGet = new HttpGet(
						"http://47.94.101.5:8080/api/ip/shop/10044");

				try {
					// ��������ִ�����󣬻�ȡ��������������Ӧ����
					HttpResponse httpResponse = httpCient.execute(httpGet);

					Log.e("�������ǣ���������", httpResponse.getStatusLine()
							.getStatusCode() + "");

					// ���Ĳ��������Ӧ��״̬�Ƿ����������״̬���ֵ��200��ʾ����
					if (httpResponse.getStatusLine().getStatusCode() == 200) {
						// ���岽������Ӧ������ȡ�����ݣ��ŵ�entity����
						HttpEntity entity = httpResponse.getEntity();
						String response = EntityUtils.toString(entity, "utf-8");// ��entity���е�����ת��Ϊ�ַ���
						// Log.e("!!!!!!!!!!!!!", response);
						if (response != null && !"".equals(response)) {

							JSONObject jsonObject = new JSONObject(response);
							String ip = jsonObject
									.getString("localAreaNetwork");
							Log.e("����ֵ�ǣ���������", ip);
							// �����߳��н�Message���󷢳�ȥ
							Message message = new Message();
							message.what = SHOW_RESPONSE;
							message.obj = ip;
							handler.sendMessage(message);
						} else {
							Handler handler = new Handler(Looper
									.getMainLooper());
							handler.post(new Runnable() {

								@Override
								public void run() {
									// ����UI�̵߳�Toast
									Toast.makeText(MainActivity.this,
											"��ǰû�дӷ�������ȡ������", Toast.LENGTH_LONG)
											.show();
								}
							});

							// Toast.makeText(MainActivity.this,
							// "��ǰû�дӷ�������ȡ������",
							// Toast.LENGTH_SHORT).show();
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}).start();// ���start()������Ҫ������
	}

	// ���������һҳ��������˳������
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		// ����һ�������õİ����ķ�����keyCode
		// �����û��Ķ���������ǰ��˷��ؼ���ͬʱwebviewҪ���صĻ���WebViewִ�л��˲�������Ϊwebview.canGoBack()���ص���һ��Boolean���ͣ��������ǰ�������Ϊtrue
//		if (keyCode == KeyEvent.KEYCODE_BACK && webview.canGoBack()) {
//			webview.goBack();
//			return true;
//		}
		  // ����ǰ����Ϊ���ؼ�ʱ
	    if(keyCode == KeyEvent.KEYCODE_BACK) {
	        // �����ǰWebView���ڷ���ջ
	        if(webview.canGoBack()) {
	            // ����ҳ�����һҳ
	        	webview.goBack();
	            return true;
	        }else {
	            // �����ǰҳΪ������ص�ҳ��ʱ���򷵻ؼ��˳�����
	            System.exit(0);
	        }
	    }
	   
		return super.onKeyDown(keyCode, event);
	}

	// ����Webview
	@Override
	protected void onDestroy() {
		if (webview != null) {
			webview.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
			webview.clearHistory();
			webview.clearCache(true);

			((ViewGroup) webview.getParent()).removeView(webview);
			webview.destroy();
			webview = null;
		}
		super.onDestroy();
	}

}