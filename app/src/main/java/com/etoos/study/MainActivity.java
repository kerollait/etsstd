package com.etoos.study;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.res.ResourcesCompat;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.DecelerateInterpolator;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.etoos.study.common.utils.CommonUtils;
import com.etoos.study.device.Device;
import com.etoos.study.device.DeviceInfo;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebViewEngine;

import cl.kunder.webview.WebViewActivity;

public class MainActivity extends CordovaActivity {

	private String LOG_TAG = "EtoosSmartStudy";
    private View splashScreen;
    private Context context;
    private Activity activity;
    private boolean doubleBackToExitPressedOnce = false;
	private CustomSwipeToRefresh mySwipeRefreshLayout;
	private ViewTreeObserver.OnScrollChangedListener mOnScrollChangedListener;

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        super.init();

        context = this;
        activity = this;

        SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();
        WebViewClient customWebViewClient = new CustomWebviewClient(systemWebViewEngine, this);

        WebView webView = (WebView) systemWebViewEngine.getView();
        webView.setWebViewClient(customWebViewClient);

		super.loadUrl(launchUrl);

		mySwipeRefreshLayout = this.findViewById(R.id.swipeContainer);
		mySwipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.color_button_default));
		mySwipeRefreshLayout.setOnRefreshListener(
				() -> {
					appView.loadUrl("javascript:fnSwipePullRefresh();");

					new Handler().postDelayed(() -> mySwipeRefreshLayout.setRefreshing(false), 1000);
				}
		);

        DeviceInfo deviceInfo = new DeviceInfo(context);

        Log.d(LOG_TAG, "device id : "+ deviceInfo.getDeviceInfo(Device.DEVICE_ID));
		Log.d(LOG_TAG, "device memory : "+ deviceInfo.getDeviceInfo(Device.DEVICE_TOTAL_MEMORY));
		Log.d(LOG_TAG, "device model : "+ deviceInfo.getDeviceInfo(Device.DEVICE_HARDWARE_MODEL));
		Log.d(LOG_TAG, "device type : "+ deviceInfo.getDeviceInfo(Device.DEVICE_TYPE));
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
            i.putExtra("url", "app/gnb/gnb.html");
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
        LinearLayout btnFooterStudyList = main.findViewById(R.id.btn_footer_study_list);
		LinearLayout btnFooterFavoriteList = main.findViewById(R.id.btn_footer_favorite_list);
        LinearLayout btnFooterDownloadList = main.findViewById(R.id.btn_footer_download_list);
        LinearLayout btnFooterMyroom = main.findViewById(R.id.btn_footer_myroom);

        btnFooterHome.setOnClickListener(view -> appView.loadUrl(launchUrl));

        btnFooterStudyList.setOnClickListener(view -> {

		});

		btnFooterFavoriteList.setOnClickListener(view -> {

		});

        btnFooterDownloadList.setOnClickListener(view -> {

		});

        btnFooterMyroom.setOnClickListener(view -> appView.loadUrl("javascript:fnGoMyroom();"));

        setContentView(main);

        appView.getView().requestFocusFromTouch();
        splashScreen = main.findViewById(R.id.splash_screen);

        final Handler handler = new Handler();
        handler.postDelayed(this::removeSplashScreen, 1000);
    }

	@Override
	public void onStart() {
		super.onStart();

		mySwipeRefreshLayout.getViewTreeObserver().addOnScrollChangedListener(mOnScrollChangedListener =
				() -> {
					if (appView.getView().getScrollY() == 0)
						mySwipeRefreshLayout.setEnabled(true);
					else
						mySwipeRefreshLayout.setEnabled(false);

				});
	}

	@Override
	public void onStop() {
		mySwipeRefreshLayout.getViewTreeObserver().removeOnScrollChangedListener(mOnScrollChangedListener);
		CommonUtils.hideLoader(this);
		super.onStop();
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

				CommonUtils.showLoader(activity);
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }
        });
    }

    @Override
    public void onBackPressed() {

    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            return true;
        } else {
            if (event.getKeyCode() == KeyEvent.KEYCODE_BACK
                    && (appView.getUrl().matches("(?i).*/www/app/index.html") || appView.getUrl().matches("(?i).*/www/app/my_room/index.html"))) {

                fnAppCloseMessageShow();
                return true;
            } else {
                super.dispatchKeyEvent(event);
            }
        }

        return true;
    }

    private void fnAppCloseMessageShow() {

        if (doubleBackToExitPressedOnce) {
            finish();
        }

        this.doubleBackToExitPressedOnce = true;
        Toast.makeText(activity, "'뒤로'버튼을 한번 더 누르시면 종료됩니다.", Toast.LENGTH_SHORT).show();

        new Handler().postDelayed(() -> doubleBackToExitPressedOnce = false, 2000);
    }
}
