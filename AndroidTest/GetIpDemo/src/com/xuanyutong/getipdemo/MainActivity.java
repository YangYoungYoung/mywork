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
	 * Handler调起Chrome浏览器，访问固定链接
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
				Log.e("拼接好的URL是------------------", font);
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
		// 如果安装了Chrome浏览器就直接打开路径，如果没有就先安装Chrome浏览器
		if (!isAppInstall(mContext, packageName)) {

			if (copyAssetsFile(mContext, apkName, path)) {
				installApk(mContext, path + apkName);
			}
		} else {
			// runApk(mContext,packageName,className);
			sendRequestWithHttpClient();
		}

		// 判断当前网络
		// if(isWifi(mContext)){
		// String ip = getIPAddress(mContext);
		// Toast.makeText(mContext, ip, Toast.LENGTH_SHORT).show();
		// Log.e(TAG, "当前IP是："+ip);
		// }else{
		// Log.e(TAG, "当前是移动流量");
		// Toast.makeText(mContext, "当前是移动流量", Toast.LENGTH_SHORT).show();
		// }
		image = (ImageView) findViewById(R.id.image);
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
						"http://47.94.101.5:8080/api/ip/shop/10039");

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
//						Log.e("!!!!!!!!!!!!!", response);
						if(response!=null&&!"".equals(response)) {
							
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
							Handler handler = new Handler(Looper.getMainLooper());
							handler.post(new Runnable() {
								
								@Override
								public void run() {
									//放在UI线程弹Toast
									Toast.makeText(MainActivity.this, "当前没有从服务器获取到数据", Toast.LENGTH_LONG).show();
								}
							});

							
//							Toast.makeText(MainActivity.this, "当前没有从服务器获取到数据",
//									Toast.LENGTH_SHORT).show();
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}).start();// 这个start()方法不要忘记了
	}

	/****
	 * 安装Chrome浏览器
	 * 
	 * @param mContext
	 * @param path
	 *            路径
	 */
	private void installApk(final Context mContext, final String path) {
		Builder mBuilder = new AlertDialog.Builder(mContext).setIcon(
				R.drawable.ic_launcher).setMessage("您需要先安装谷歌浏览器。");
		mBuilder.setPositiveButton("好的",
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
	 * 复制文件到SD卡
	 * 
	 * @param context
	 * @param fileName
	 *            复制的文件名
	 * @param path
	 *            保存的目录路径
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
	 * App是否已安装
	 * 
	 * @param mContext
	 * @param packageName
	 *            包名
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
	 * 运行安装好的APK
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
		mIntent.putExtra("content", "第一个app传过来的数据");
		mContext.startActivity(mIntent);
	}

//	/****
//	 * 判断当前网络状态是否是WIFI
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
//	 * 获取当前局域网IP
//	 * 
//	 * @param context
//	 * @return
//	 */
//	public static String getIPAddress(Context context) {
//		NetworkInfo info = ((ConnectivityManager) context
//				.getSystemService(Context.CONNECTIVITY_SERVICE))
//				.getActiveNetworkInfo();
//		if (info != null && info.isConnected()) {
//			if (info.getType() == ConnectivityManager.TYPE_MOBILE) {// 当前使用2G/3G/4G网络
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
//			} else if (info.getType() == ConnectivityManager.TYPE_WIFI) {// 当前使用无线网络
//				WifiManager wifiManager = (WifiManager) context
//						.getSystemService(Context.WIFI_SERVICE);
//				WifiInfo wifiInfo = wifiManager.getConnectionInfo();
//				String ipAddress = intIP2StringIP(wifiInfo.getIpAddress());// 得到IPV4地址
//				return ipAddress;
//			}
//		} else {
//
//			System.out.println("当前无网络连接,请在设置中打开网络");
//		}
//		return null;
//	}
//
//	/**
//	 * 将得到的int类型的IP转换为String类型
//	 * 
//	 * @param ip
//	 * @return
//	 */
//	public static String intIP2StringIP(int ip) {
//		return (ip & 0xFF) + "." + ((ip >> 8) & 0xFF) + "."
//				+ ((ip >> 16) & 0xFF) + "." + (ip >> 24 & 0xFF);
//	}

}
