package com.etoos.study;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.res.ResourcesCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.etoos.study.common.utils.CommonUtils;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.engine.SystemWebViewEngine;


public class LoginActivity extends CordovaActivity {
	private CustomSwipeToRefresh mySwipeRefreshLayout;
	private ViewTreeObserver.OnScrollChangedListener mOnScrollChangedListener;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			overridePendingTransition(R.anim.activity_open_translate, R.anim.activity_close_scale);
		}

		super.init();

		SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();
		WebViewClient customWebViewClient = new CustomWebviewClient(systemWebViewEngine, this);

		WebView webView = (WebView) systemWebViewEngine.getView();
		webView.setWebViewClient(customWebViewClient);

		String returnUrl = "";
		Bundle b = getIntent().getExtras();

		try {
			returnUrl = b.getString("return_url");
		} catch(Exception e) {

		}

		super.loadUrl("file:///android_asset/www/app/member/login.html?return_url="+ returnUrl);

		mySwipeRefreshLayout = this.findViewById(R.id.swipeContainer);
		mySwipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.color_button_default));
		mySwipeRefreshLayout.setOnRefreshListener(
				() -> {
					appView.loadUrl("javascript:fnSwipePullRefresh();");

					new Handler().postDelayed(() -> mySwipeRefreshLayout.setRefreshing(false), 1000);
				}
		);
	}

	@SuppressWarnings({"deprecation", "ResourceType", "InflateParams"})
	@Override
	protected void createViews() {

		// Main container layout
		LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View main = inflater.inflate(R.layout.main, null);

		main.findViewById(R.id.footer).setVisibility(View.GONE);
		main.findViewById(R.id.splash_screen).setVisibility(View.GONE);


		main.findViewById(R.id.iv_menu).setVisibility(View.GONE);
		main.findViewById(R.id.iv_back).setVisibility(View.VISIBLE);

		main.findViewById(R.id.btn_header_left).setOnClickListener(v -> fnClose());

		TextView tvTitle = main.findViewById(R.id.tv_title);
		tvTitle.setText("로그인");

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			Typeface typeface = ResourcesCompat.getFont(this, R.font.noto_sans_kr_black_);
			tvTitle.setTypeface(typeface);
		}

		main.findViewById(R.id.ll_title).setVisibility(View.GONE);
		tvTitle.setVisibility(View.VISIBLE);

		appView.getView().setId(300);
		appView.getView().setLayoutParams(new RelativeLayout.LayoutParams(
				ViewGroup.LayoutParams.MATCH_PARENT,
				ViewGroup.LayoutParams.MATCH_PARENT));

		// Add our webview to our main view/layout
		RelativeLayout rl = main.findViewById(R.id.content);
		rl.addView(appView.getView());

		setContentView(main);

		if (preferences.contains("BackgroundColor")) {
			try {
				int backgroundColor = preferences.getInteger("BackgroundColor", Color.BLACK);
				// Background of activity:
				appView.getView().setBackgroundColor(backgroundColor);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}

		appView.getView().requestFocusFromTouch();
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
	public void onPause() {
		super.onPause();

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			overridePendingTransition(R.anim.activity_open_scale, R.anim.activity_close_translate);
		}
	}

	@Override
	public void onBackPressed() {
		fnClose();
	}

	public void fnClose() {
		CommonUtils.hideLoader(this);

		Intent i = new Intent();
		setResult(Activity.RESULT_CANCELED, i);

		finish();
	}
}