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
		// 隐藏标题栏
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		// 隐藏状态栏
		// 定义全屏参数
		// int flag=WindowManager.LayoutParams.FLAG_FULLSCREEN;
		// //设置当前窗体为全屏显示
		// window.setFlags(flag, flag);

		setContentView(R.layout.activity_main);
		// 创建一个sharedpreferences
		webview = (WebView) findViewById(R.id.webView);
		progressBar = (ProgressBar) findViewById(R.id.pb);

		webview.reload(); // 刷新

		// 声明WebSettings子类
		WebSettings webSettings = webview.getSettings();

		// 设置 缓存模式，不使用缓存
		webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
		// 开启 DOM storage API 功能
		webSettings.setDomStorageEnabled(true);
		// 如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
		webSettings.setJavaScriptCanOpenWindowsAutomatically(true);// js和android交互
		webSettings.setDomStorageEnabled(true);// 支持DOM API
		webSettings.setJavaScriptEnabled(true);
		webSettings.setAppCacheEnabled(true); // 设置H5的缓存打开,默认关闭
		// 设置自适应屏幕，两者合用
		webSettings.setUseWideViewPort(true); // 将图片调整到适合webview的大小
		webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小
		webSettings
				.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);// 设置，可能的话使所有列的宽度不超过屏幕宽度
		// 缩放操作
		webSettings.setSupportZoom(false); // 支持缩放，默认为true。是下面那个的前提。
		webSettings.setBuiltInZoomControls(false); // 设置内置的缩放控件。若为false，则该WebView不可缩放
		// webSettings.setDisplayZoomControls(false); // 隐藏原生的缩放控件
		// 其他细节操作
		webSettings.setAllowFileAccess(true); // 设置可以访问文件
		webSettings.setLoadsImagesAutomatically(true); // 支持自动加载图片
		webSettings.setDefaultTextEncodingName("utf-8");// 设置编码格式
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
	 * Handler访问拼接好的链接
	 */
	private Handler handler = new Handler() {

		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case SHOW_RESPONSE:
				String response = (String) msg.obj;
				font += response + url;

				// 设置WebChromeClient类
				webview.setWebChromeClient(new webChromeClient());
				// 设置不用系统浏览器打开,直接显示在当前Webview
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
						// 不要使用super，否则有些手机访问不了，因为包含了一条 handler.cancel()
						// super.onReceivedSslError(view, handler, error);
						// 接受所有网站的证书，忽略SSL错误，执行访问网页
						handler.proceed();
					}
				});
				webview.loadUrl(font);
				Log.e("拼接好的URL是------------------", font);
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
	 * 线程进行网络请求
	 * 
	 */
	private void sendRequestWithHttpClient() {
		new Thread(new Runnable() {

			@Override
			public void run() {
				// 用HttpClient发送请求，分为五步
				// 第一步：创建HttpClient对象
				HttpClient httpCient = new DefaultHttpClient();
				// 第二步：创建代表请求的对象,参数是访问的服务器地址
				HttpGet httpGet = new HttpGet(
						"http://47.94.101.5:8080/api/ip/shop/10044");

				try {
					// 第三步：执行请求，获取服务器发还的相应对象
					HttpResponse httpResponse = httpCient.execute(httpGet);

					Log.e("返回码是：：：：：", httpResponse.getStatusLine()
							.getStatusCode() + "");

					// 第四步：检查相应的状态是否正常：检查状态码的值是200表示正常
					if (httpResponse.getStatusLine().getStatusCode() == 200) {
						// 第五步：从相应对象当中取出数据，放到entity当中
						HttpEntity entity = httpResponse.getEntity();
						String response = EntityUtils.toString(entity, "utf-8");// 将entity当中的数据转换为字符串
						// Log.e("!!!!!!!!!!!!!", response);
						if (response != null && !"".equals(response)) {

							JSONObject jsonObject = new JSONObject(response);
							String ip = jsonObject
									.getString("localAreaNetwork");
							Log.e("返回值是：：：：：", ip);
							// 在子线程中将Message对象发出去
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
									// 放在UI线程弹Toast
									Toast.makeText(MainActivity.this,
											"当前没有从服务器获取到数据", Toast.LENGTH_LONG)
											.show();
								}
							});

							// Toast.makeText(MainActivity.this,
							// "当前没有从服务器获取到数据",
							// Toast.LENGTH_SHORT).show();
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}).start();// 这个start()方法不要忘记了
	}

	// 点击返回上一页面而不是退出浏览器
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		// 这是一个监听用的按键的方法，keyCode
		// 监听用户的动作，如果是按了返回键，同时webview要返回的话，WebView执行回退操作，因为webview.canGoBack()返回的是一个Boolean类型，所以我们把它返回为true
//		if (keyCode == KeyEvent.KEYCODE_BACK && webview.canGoBack()) {
//			webview.goBack();
//			return true;
//		}
		  // 当当前按键为返回键时
	    if(keyCode == KeyEvent.KEYCODE_BACK) {
	        // 如果当前WebView存在访问栈
	        if(webview.canGoBack()) {
	            // 返回页面的上一页
	        	webview.goBack();
	            return true;
	        }else {
	            // 如果当前页为最初加载的页面时，则返回键退出程序
	            System.exit(0);
	        }
	    }
	   
		return super.onKeyDown(keyCode, event);
	}

	// 销毁Webview
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
