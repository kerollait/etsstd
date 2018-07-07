package com.etoos.study;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.res.ResourcesCompat;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.DecelerateInterpolator;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.etoos.study.common.utils.CommonUtils;
import com.etoos.study.device.Device;
import com.etoos.study.device.DeviceInfo;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebViewEngine;


import java.lang.ref.WeakReference;

import cl.kunder.webview.WebViewActivity;

public class MainActivity extends CordovaActivity {

    private boolean mFlag = false;
    private View splashScreen;
    private Context context;
    private Activity activity;
    private WebViewClient customWebViewClient;

    private int ACTIVITY_RESULT_CODE_LOGIN = 1000;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        super.init();

        context = this;
        activity = this;

        SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();
        customWebViewClient = new CustomWebviewClient(systemWebViewEngine, this);

        WebView webView = (WebView) systemWebViewEngine.getView();
        webView.setWebViewClient(customWebViewClient);

        super.loadUrl(launchUrl);

        DeviceInfo deviceInfo = new DeviceInfo(context);

        Log.d("EtoosSmartStudy", "device id : "+ deviceInfo.getDeviceInfo(Device.DEVICE_ID));
		Log.d("EtoosSmartStudy", "device memory : "+ deviceInfo.getDeviceInfo(Device.DEVICE_TOTAL_MEMORY));
		Log.d("EtoosSmartStudy", "device model : "+ deviceInfo.getDeviceInfo(Device.DEVICE_HARDWARE_MODEL));
		Log.d("EtoosSmartStudy", "device type : "+ deviceInfo.getDeviceInfo(Device.DEVICE_TYPE));
    }

    @SuppressWarnings({"deprecation", "ResourceType", "InflateParams"})
    @Override
    protected void createViews() {

        // Main container layout
        LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		assert inflater != null;
		View main = inflater.inflate(R.layout.main, null);

        appView.getView().setId(100);
        appView.getView().setLayoutParams(new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        RelativeLayout rl = main.findViewById(R.id.content);
        rl.addView(appView.getView());

        LinearLayout llTitleHome = main.findViewById(R.id.ll_title);
        TextView tvTitle = main.findViewById(R.id.tv_title);
        TextView tvTitleGrade = main.findViewById(R.id.tv_title_grade);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Typeface typeface = ResourcesCompat.getFont(this, R.font.noto_sans_kr_black_);
            tvTitle.setTypeface(typeface);
            tvTitleGrade.setTypeface(typeface);
        }

        RelativeLayout navBtn = main.findViewById(R.id.btn_header_left);
        navBtn.setOnClickListener(v -> {
            Intent i = new Intent(context, WebViewActivity.class);
            i.putExtra("url", "app/common/gnb.html");
            i.putExtra("shouldShowLoading", false);
            i.putExtra("title", "");
            i.putExtra("animType", "from_left");
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            appView.loadUrl("javascript:webview.SubscribeCallback(onWebviewSubscribeCallback, onWebviewSubscribeCallbackError);");
            startActivity(i);
        });

        llTitleHome.setVisibility(View.VISIBLE);
        tvTitle.setVisibility(View.GONE);

        LinearLayout btnFooterHome = main.findViewById(R.id.btn_footer_home);
        LinearLayout btnFooterRecentPlayList = main.findViewById(R.id.btn_footer_recent_playlist);
        LinearLayout btnFooterDownloadList = main.findViewById(R.id.btn_footer_download_list);
        LinearLayout btnFooterMyroom = main.findViewById(R.id.btn_footer_myroom);

        btnFooterHome.setOnClickListener(view -> {
        	appView.loadUrl(launchUrl);
		});

        btnFooterRecentPlayList.setOnClickListener(view -> {

		});

        btnFooterDownloadList.setOnClickListener(view -> {

		});

        btnFooterMyroom.setOnClickListener(view -> {
        	appView.loadUrl("file:///android_asset/www/app/my_room/index.html");
		});

        setContentView(main);

        appView.getView().requestFocusFromTouch();
        splashScreen = main.findViewById(R.id.splash_screen);

        final Handler handler = new Handler();
        handler.postDelayed(this::removeSplashScreen, 1000);
    }

	@Override
	public void onDestroy() {
		super.onDestroy();

		android.os.Process.killProcess(android.os.Process.myPid());
	}

    private void removeSplashScreen() {
        AlphaAnimation fadeOut = new AlphaAnimation(1, 0);
        fadeOut.setInterpolator(new DecelerateInterpolator());
        fadeOut.setDuration(200);

        splashScreen.setAnimation(fadeOut);
        splashScreen.startAnimation(fadeOut);

        fadeOut.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
				splashScreen.setVisibility(View.GONE);
				splashScreen = null;

				//String token = EtoosData.getToken();
				//if (token == null || token.isEmpty()) {
				//	Intent i = new Intent(context, LoginActivity.class);
				//	i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				//	startActivityForResult(i, ACTIVITY_RESULT_CODE_LOGIN);
				//} else {
					CommonUtils.showLoader(activity);
				//}
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }
        });
    }
}
