package com.etoos.study.device;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.content.Context;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.DisplayMetrics;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

public class DeviceInfo {
	private String TAG = "DeviceInfo";
	private Context context;

	public DeviceInfo(Context context) {
		this.context = context;
	}

	public String getDeviceInfo(Device device) {
		try {
			switch (device) {
				case DEVICE_ID:
					return getDeviceId();
				case DEVICE_LANGUAGE:
					return Locale.getDefault().getDisplayLanguage();
				case DEVICE_TIME_ZONE:
					return TimeZone.getDefault().getID();//(false, TimeZone.SHORT);
				case DEVICE_LOCAL_COUNTRY_CODE:
					return context.getResources().getConfiguration().locale.getCountry();
				case DEVICE_CURRENT_YEAR:
					return "" + (Calendar.getInstance().get(Calendar.YEAR));
				case DEVICE_CURRENT_DATE_TIME:
					Calendar calendarTime = Calendar.getInstance(TimeZone.getDefault(), Locale.getDefault());
					long time = (calendarTime.getTimeInMillis() / 1000);
					return String.valueOf(time);
				//                    return DateFormat.getDateTimeInstance().format(new Date());
				case DEVICE_CURRENT_DATE_TIME_ZERO_GMT:
					Calendar calendarTime_zero = Calendar.getInstance(TimeZone.getTimeZone("GMT+0"), Locale.getDefault());
					return String.valueOf((calendarTime_zero.getTimeInMillis() / 1000));
				//                    DateFormat df = DateFormat.getDateTimeInstance();
				//                    df.setTimeZone(TimeZone.getTimeZone("GMT+0"));
				//                    return df.format(new Date());
				case DEVICE_HARDWARE_MODEL:
					return getDeviceName();
				case DEVICE_NUMBER_OF_PROCESSORS:
					return Runtime.getRuntime().availableProcessors() + "";
				case DEVICE_LOCALE:
					return Locale.getDefault().getISO3Country();
				case DEVICE_TOTAL_MEMORY:
					if (Build.VERSION.SDK_INT >= 16)
						return String.valueOf(getTotalMemory());
				case DEVICE_FREE_MEMORY:
					return String.valueOf(getFreeMemory());
				case DEVICE_USED_MEMORY:
					if (Build.VERSION.SDK_INT >= 16) {
						long freeMem = getTotalMemory() - getFreeMemory();
						return String.valueOf(freeMem);
					}
					return "";
				case DEVICE_MANUFACTURE:
					return android.os.Build.MANUFACTURER;
				case DEVICE_SYSTEM_VERSION:
					return String.valueOf(getDeviceName());
				case DEVICE_VERSION:
					return String.valueOf(android.os.Build.VERSION.SDK_INT);
				case DEVICE_IN_INCH:
					return getDeviceInch();
				case DEVICE_NETWORK_TYPE:
					return getNetworkType();
				case DEVICE_NETWORK:
					return checkNetworkStatus();
				case DEVICE_TYPE:
					if (isTablet()) {
						if (getDeviceMoreThan5Inch()) {
							return "Tablet";
						} else
							return "Mobile";
					} else {
						return "Mobile";
					}
				case DEVICE_SYSTEM_NAME:
					return "Android OS";
				default:
					break;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "";
	}

	public String getDeviceId() {
		String deviceIdOfTelephony = getDeviceIdOfTelephony();
		if (deviceIdOfTelephony != null) {
			return deviceIdOfTelephony;
		}
		deviceIdOfTelephony = getDeviceIdOfWifi();
		if (deviceIdOfTelephony != null) {
			return deviceIdOfTelephony;
		}
		deviceIdOfTelephony = getDeviceIdOfAndroidID();

		return deviceIdOfTelephony == null ? UUID.randomUUID().toString() : deviceIdOfTelephony;
	}

	public String getDeviceIdOfAndroidID() {
		String str = null;
		@SuppressLint("HardwareIds") String string = Settings.Secure.getString(this.context.getContentResolver(), "android_id");
		if (string == null || "9774d56d682e549c".equals(string)) {
			return str;
		}
		try {
			Log.i(TAG, "[getDeviceID] getDeviceIdOfAndroidID - selected !");
			return UUID.nameUUIDFromBytes(string.getBytes("utf8")).toString();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return str;
		}
	}

	public String getDeviceIdOfTelephony() {
		try {
			@SuppressLint("HardwareIds") String deviceId = ((TelephonyManager) this.context.getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();
			if (deviceId != null) {
				if ("000000000000000".equals(deviceId)) {
					return null;
				}
				try {
					Log.i(TAG, "[getDeviceID] getDeviceIdOfTelephony - selected !");
					return UUID.nameUUIDFromBytes(deviceId.getBytes("utf8")).toString();
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
			return null;
		} catch (SecurityException e2) {
			throw e2;
		}
	}

	@SuppressLint("HardwareIds")
	public String getDeviceIdOfWifi() {
		String str = "";
		if (Build.VERSION.SDK_INT >= 23) {
			Log.d(TAG, "[getDeviceID] method type : new wifi method");
			try {
				for (NetworkInterface networkInterface : Collections.list(NetworkInterface.getNetworkInterfaces())) {
					if (networkInterface.getName().equalsIgnoreCase("wlan0")) {
						byte[] hardwareAddress = networkInterface.getHardwareAddress();
						if (hardwareAddress == null) {
							return null;
						}
						StringBuilder stringBuilder = new StringBuilder();
						for (byte b : hardwareAddress) {
							stringBuilder.append(String.format("%02x", b)).append(":");
						}
						if (stringBuilder.length() > 0) {
							stringBuilder.deleteCharAt(stringBuilder.length() - 1);
						}
						Log.i(TAG, "[getDeviceID] macAddress : " + stringBuilder.toString());
						try {
							stringBuilder.deleteCharAt(2);
							stringBuilder.deleteCharAt(4);
							stringBuilder.deleteCharAt(6);
							stringBuilder.deleteCharAt(8);
							stringBuilder.deleteCharAt(10);
						} catch (Exception e) {
							e.printStackTrace();
						}
						Log.i(TAG, "[getDeviceID] getWifiDeviceID - selected !");
						return UUID.nameUUIDFromBytes(stringBuilder.toString().getBytes("utf8")).toString();
					}
				}
			} catch (SocketException | UnsupportedEncodingException e2) {
				e2.printStackTrace();
			}
			return null;
		}
		Log.d(TAG, "[getDeviceID] method type : old wifi method");
		@SuppressLint("WrongConstant") WifiManager wifiManager = (WifiManager) this.context.getSystemService("wifi");
		if (wifiManager != null) {
			WifiInfo connectionInfo = wifiManager.getConnectionInfo();
			if (connectionInfo == null) {
				return null;
			}
			str = connectionInfo.getMacAddress();
			if (str == null) {
				str = "/sys/class/net/wlan0/address";
				if (!new File(str).exists()) {
					return null;
				}

				str = loadFileAsString(str);
			}
			try {
				Log.i(TAG, "[getDeviceID] macAddress : " + str);
				if (str != null) {
					str = str.replace("-", "");
				}
				Log.i(TAG, "[getDeviceID] getWifiDeviceID - selected !");
				if (str != null) {
					return UUID.nameUUIDFromBytes(str.getBytes("utf8")).toString();
				}
			} catch (Exception e5) {
				e5.printStackTrace();
			}
		}
		return null;
	}

	private String loadFileAsString(String str) {
		StringBuilder stringBuffer = new StringBuilder(1000);
		BufferedReader bufferedReader = null;
		try {
			bufferedReader = new BufferedReader(new FileReader(str));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		char[] cArr = new char[1024];
		while (true) {
			int read = 0;
			try {
				if (bufferedReader != null) {
					read = bufferedReader.read(cArr);
				}
			} catch (IOException e) {
				e.printStackTrace();
				return null;
			}
			if (read != -1) {
				stringBuffer.append(String.valueOf(cArr, 0, read));
			} else {
				try {
					bufferedReader.close();
				} catch (IOException e) {
					e.printStackTrace();
					return null;
				}

				return stringBuffer.toString();
			}
		}
	}


	@SuppressLint("NewApi")
	private long getTotalMemory() {
		try {
			ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
			ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
			if (activityManager != null) {
				activityManager.getMemoryInfo(mi);
			}

			return mi.totalMem / 1048576L;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	private long getFreeMemory() {
		try {
			ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
			ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
			if (activityManager != null) {
				activityManager.getMemoryInfo(mi);
			}

			return mi.availMem / 1048576L;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	private String getDeviceName() {
		String model = Build.MODEL;
		return capitalize(model);
	}

	private String capitalize(String s) {
		if (s == null || s.length() == 0) {
			return "";
		}
		char first = s.charAt(0);
		if (Character.isUpperCase(first)) {
			return s;
		} else {
			return Character.toUpperCase(first) + s.substring(1);
		}
	}

	/**
	 * Convert byte array to hex string
	 *
	 * @param bytes
	 * @return
	 */
	private String bytesToHex(byte[] bytes) {
		StringBuilder sbuf = new StringBuilder();
		for (int idx = 0; idx < bytes.length; idx++) {
			int intVal = bytes[idx] & 0xff;
			if (intVal < 0x10)
				sbuf.append("0");
			sbuf.append(Integer.toHexString(intVal).toUpperCase());
		}
		return sbuf.toString();
	}

	/**
	 * Returns MAC address of the given interface name.
	 *
	 * @param interfaceName eth0, wlan0 or NULL=use first interface
	 * @return mac address or empty string
	 */
	@SuppressLint("NewApi")
	private String getMACAddress(String interfaceName) {
		try {

			List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
			for (NetworkInterface intf : interfaces) {
				if (interfaceName != null) {
					if (!intf.getName().equalsIgnoreCase(interfaceName))
						continue;
				}
				byte[] mac = intf.getHardwareAddress();
				if (mac == null)
					return "";
				StringBuilder buf = new StringBuilder();
				for (int idx = 0; idx < mac.length; idx++)
					buf.append(String.format("%02X:", mac[idx]));
				if (buf.length() > 0)
					buf.deleteCharAt(buf.length() - 1);
				return buf.toString();
			}
		} catch (Exception ex) {
			return "";
		} // for now eat exceptions
		return "";
		/*
		 * try { // this is so Linux hack return
		 * loadFileAsString("/sys/class/net/" +interfaceName +
		 * "/address").toUpperCase().trim(); } catch (IOException ex) { return
		 * null; }
		 */
	}


	public String getNetworkType() {
		String networkStatus = "";

		final ConnectivityManager connMgr = (ConnectivityManager)
				context.getSystemService(Context.CONNECTIVITY_SERVICE);
		// check for wifi
		final android.net.NetworkInfo wifi =
				connMgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
		// check for mobile data
		final android.net.NetworkInfo mobile =
				connMgr.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);

		if (wifi.isAvailable()) {
			networkStatus = "Wifi";
		} else if (mobile.isAvailable()) {
			networkStatus = getDataType();
		} else {
			networkStatus = "noNetwork";
		}
		return networkStatus;
	}

	public String checkNetworkStatus() {
		String networkStatus = "";
		try {
			// Get connect mangaer
			final ConnectivityManager connMgr = (ConnectivityManager)
					context.getSystemService(Context.CONNECTIVITY_SERVICE);
			// // check for wifi
			final android.net.NetworkInfo wifi =
					connMgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
			// // check for mobile data
			final android.net.NetworkInfo mobile =
					connMgr.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);

			if (wifi.isAvailable()) {
				networkStatus = "Wifi";
			} else if (mobile.isAvailable()) {
				networkStatus = getDataType();
			} else {
				networkStatus = "noNetwork";
				networkStatus = "0";
			}


		} catch (Exception e) {
			e.printStackTrace();
			networkStatus = "0";
		}
		return networkStatus;

	}

	public boolean isTablet() {
		return (context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
	}

	public boolean getDeviceMoreThan5Inch() {
		try {
			DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
			// int width = displayMetrics.widthPixels;
			// int height = displayMetrics.heightPixels;

			float yInches = displayMetrics.heightPixels / displayMetrics.ydpi;
			float xInches = displayMetrics.widthPixels / displayMetrics.xdpi;
			double diagonalInches = Math.sqrt(xInches * xInches + yInches * yInches);
			// 5inch device or bigger
// smaller device
			return diagonalInches >= 7;
		} catch (Exception e) {
			return false;
		}
	}

	public String getDeviceInch() {
		try {
			DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();

			float yInches = displayMetrics.heightPixels / displayMetrics.ydpi;
			float xInches = displayMetrics.widthPixels / displayMetrics.xdpi;
			double diagonalInches = Math.sqrt(xInches * xInches + yInches * yInches);
			return String.valueOf(diagonalInches);
		} catch (Exception e) {
			return "-1";
		}
	}

	public String getDataType() {
		String type = "Mobile Data";
		TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
		switch (tm.getNetworkType()) {
			case TelephonyManager.NETWORK_TYPE_HSDPA:
				type = "Mobile Data 3G";
				Log.d("Type", "3g");
				// for 3g HSDPA networktype will be return as
				// per testing(real) in device with 3g enable
				// data
				// and speed will also matters to decide 3g network type
				break;
			case TelephonyManager.NETWORK_TYPE_HSPAP:
				type = "Mobile Data 4G";
				Log.d("Type", "4g");
				// No specification for the 4g but from wiki
				// i found(HSPAP used in 4g)
				break;
			case TelephonyManager.NETWORK_TYPE_GPRS:
				type = "Mobile Data GPRS";
				Log.d("Type", "GPRS");
				break;
			case TelephonyManager.NETWORK_TYPE_EDGE:
				type = "Mobile Data EDGE 2G";
				Log.d("Type", "EDGE 2g");
				break;

		}

		return type;
	}
}
