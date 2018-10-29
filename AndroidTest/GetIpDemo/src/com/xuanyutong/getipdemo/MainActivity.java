package com.xuanyutong.getipdemo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.Window;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

public class MainActivity extends Activity {
	
	private ImageView image;
	public static final int SHOW_RESPONSE = 0;
	private String url = ":8082/admin/app";
	private String font = "http://";
	private String packageName = "com.android.chrome";
	private String TAG = "MainActivity";
	private String path = Environment.getExternalStorageDirectory()
			+ "/copyDemo/";
	private String className = "com.google.android.apps.chrome.Main";
	private String apkName = "chrome.apk";
	private Context mContext;

	/****
	 * 
	 * Handler����Chrome����������ʹ̶�����
	 */
	private Handler handler = new Handler() {

		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case SHOW_RESPONSE:
				String response = (String) msg.obj;
				font += response + url;
				Intent intent = new Intent();
				// Intent intent = new Intent(Intent.ACTION_VIEW,uri);
				intent.setAction("android.intent.action.VIEW");
				Uri content_url = Uri.parse(font);
				intent.setData(content_url);
				intent.setClassName(packageName,
						className);
				startActivity(intent);
				Log.e("ƴ�Ӻõ�URL��------------------", font);
				finish();
				break;

			default:
				break;
			}
		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.activity_main);
		mContext = MainActivity.this;
		// �����װ��Chrome�������ֱ�Ӵ�·�������û�о��Ȱ�װChrome�����
		if (!isAppInstall(mContext, packageName)) {

			if (copyAssetsFile(mContext, apkName, path)) {
				installApk(mContext, path + apkName);
			}
		} else {
			// runApk(mContext,packageName,className);
			sendRequestWithHttpClient();
		}

		// �жϵ�ǰ����
		// if(isWifi(mContext)){
		// String ip = getIPAddress(mContext);
		// Toast.makeText(mContext, ip, Toast.LENGTH_SHORT).show();
		// Log.e(TAG, "��ǰIP�ǣ�"+ip);
		// }else{
		// Log.e(TAG, "��ǰ���ƶ�����");
		// Toast.makeText(mContext, "��ǰ���ƶ�����", Toast.LENGTH_SHORT).show();
		// }
		image = (ImageView) findViewById(R.id.image);
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
						"http://47.94.101.5:8080/api/ip/shop/10039");

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
//						Log.e("!!!!!!!!!!!!!", response);
						if(response!=null&&!"".equals(response)) {
							
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
							Handler handler = new Handler(Looper.getMainLooper());
							handler.post(new Runnable() {
								
								@Override
								public void run() {
									//����UI�̵߳�Toast
									Toast.makeText(MainActivity.this, "��ǰû�дӷ�������ȡ������", Toast.LENGTH_LONG).show();
								}
							});

							
//							Toast.makeText(MainActivity.this, "��ǰû�дӷ�������ȡ������",
//									Toast.LENGTH_SHORT).show();
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}).start();// ���start()������Ҫ������
	}

	/****
	 * ��װChrome�����
	 * 
	 * @param mContext
	 * @param path
	 *            ·��
	 */
	private void installApk(final Context mContext, final String path) {
		Builder mBuilder = new AlertDialog.Builder(mContext).setIcon(
				R.drawable.ic_launcher).setMessage("����Ҫ�Ȱ�װ�ȸ��������");
		mBuilder.setPositiveButton("�õ�",
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {
						// TODO Auto-generated method stub
						Intent mIntent = new Intent(Intent.ACTION_VIEW);
						mIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						mIntent.setDataAndType(Uri.parse("file://" + path),
								"application/vnd.android.package-archive");
						mContext.startActivity(mIntent);
						try {
							// runApk(mContext, path, className);
							sendRequestWithHttpClient();
						} catch (Exception e) {
							// TODO: handle exception
						}
					}
				});
		
		mBuilder.show();
	}

	/**
	 * �����ļ���SD��
	 * 
	 * @param context
	 * @param fileName
	 *            ���Ƶ��ļ���
	 * @param path
	 *            �����Ŀ¼·��
	 * @return
	 */
	private boolean copyAssetsFile(Context context, String fileName, String path) {
		// TODO Auto-generated method stub
		try {
			InputStream mInputStream = context.getAssets().open(fileName);
			File file = new File(path);
			if (!file.exists()) {
				file.mkdir();
			}
			File mFile = new File(path + apkName);
			if (!mFile.exists())
				mFile.createNewFile();
			FileOutputStream mFileOutputStream = new FileOutputStream(mFile);
			byte[] mbyte = new byte[1024];
			int i = 0;
			while ((i = mInputStream.read(mbyte)) > 0) {
				mFileOutputStream.write(mbyte, 0, i);
			}
			mInputStream.close();
			mFileOutputStream.close();
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Log.i(TAG, fileName + "not exists" + "or write err");
			return false;
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}
	}

	/**
	 * App�Ƿ��Ѱ�װ
	 * 
	 * @param mContext
	 * @param packageName
	 *            ����
	 * @return
	 */
	private boolean isAppInstall(Context mContext, String packageName) {
		PackageInfo mInfo;
		try {
			mInfo = mContext.getPackageManager().getPackageInfo(packageName, 0);
		} catch (Exception e) {
			// TODO: handle exception
			mInfo = null;
		}
		if (mInfo == null) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * ���а�װ�õ�APK
	 * 
	 * @param mContext
	 * @param packageName
	 * @param className
	 */
	private void runApk(Context mContext, String packageName, String className) {
		Intent mIntent = new Intent(Intent.ACTION_VIEW);
		mIntent.addCategory(Intent.CATEGORY_LAUNCHER);
		ComponentName mComponentName = new ComponentName(packageName, className);
		mIntent.setComponent(mComponentName);
		mIntent.putExtra("content", "��һ��app������������");
		mContext.startActivity(mIntent);
	}

//	/****
//	 * �жϵ�ǰ����״̬�Ƿ���WIFI
//	 * 
//	 * @param mContext
//	 * @return
//	 */
//	private static boolean isWifi(Context mContext) {
//		ConnectivityManager connectivityManager = (ConnectivityManager) mContext
//				.getSystemService(Context.CONNECTIVITY_SERVICE);
//		NetworkInfo info = connectivityManager.getActiveNetworkInfo();
//		if (info != null && info.getType() == ConnectivityManager.TYPE_WIFI) {
//			return true;
//		}
//		return false;
//	}
//
//	/****
//	 * 
//	 * ��ȡ��ǰ������IP
//	 * 
//	 * @param context
//	 * @return
//	 */
//	public static String getIPAddress(Context context) {
//		NetworkInfo info = ((ConnectivityManager) context
//				.getSystemService(Context.CONNECTIVITY_SERVICE))
//				.getActiveNetworkInfo();
//		if (info != null && info.isConnected()) {
//			if (info.getType() == ConnectivityManager.TYPE_MOBILE) {// ��ǰʹ��2G/3G/4G����
//				try {
//					// Enumeration<NetworkInterface>
//					// en=NetworkInterface.getNetworkInterfaces();
//					for (Enumeration<NetworkInterface> en = NetworkInterface
//							.getNetworkInterfaces(); en.hasMoreElements();) {
//						NetworkInterface intf = en.nextElement();
//						for (Enumeration<InetAddress> enumIpAddr = intf
//								.getInetAddresses(); enumIpAddr
//								.hasMoreElements();) {
//							InetAddress inetAddress = enumIpAddr.nextElement();
//							if (!inetAddress.isLoopbackAddress()
//									&& inetAddress instanceof Inet4Address) {
//								return inetAddress.getHostAddress();
//							}
//						}
//					}
//				} catch (SocketException e) {
//					e.printStackTrace();
//				}
//
//			} else if (info.getType() == ConnectivityManager.TYPE_WIFI) {// ��ǰʹ����������
//				WifiManager wifiManager = (WifiManager) context
//						.getSystemService(Context.WIFI_SERVICE);
//				WifiInfo wifiInfo = wifiManager.getConnectionInfo();
//				String ipAddress = intIP2StringIP(wifiInfo.getIpAddress());// �õ�IPV4��ַ
//				return ipAddress;
//			}
//		} else {
//
//			System.out.println("��ǰ����������,���������д�����");
//		}
//		return null;
//	}
//
//	/**
//	 * ���õ���int���͵�IPת��ΪString����
//	 * 
//	 * @param ip
//	 * @return
//	 */
//	public static String intIP2StringIP(int ip) {
//		return (ip & 0xFF) + "." + ((ip >> 8) & 0xFF) + "."
//				+ ((ip >> 16) & 0xFF) + "." + (ip >> 24 & 0xFF);
//	}

}
