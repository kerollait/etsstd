package cl.kunder.webview;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.res.ResourcesCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.etoos.study.CustomSwipeToRefresh;
import com.etoos.study.CustomWebviewClient;
import com.etoos.study.R;
import com.etoos.study.common.utils.CommonUtils;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.engine.SystemWebViewEngine;

public class WebViewActivity extends CordovaActivity {
    static Activity activity2;
    private String title = "";
    private String animType = "";
    private boolean shouldShowLoading = true;
	private CustomSwipeToRefresh mySwipeRefreshLayout;
	private ViewTreeObserver.OnScrollChangedListener mOnScrollChangedListener;

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        activity2 = this;
        Bundle b = getIntent().getExtras();
        String url = b.getString("url");

        try {
            title = b.getString("title");
        } catch (Exception e) {

        }

        try {
            animType = b.getString("animType");
        } catch (Exception e) {

        }

        if (animType != null && animType.equals("from_left")) {
            overridePendingTransition(R.anim.slide_from_left, R.anim.slide_to_right);
        } else {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                overridePendingTransition(R.anim.activity_open_translate, R.anim.activity_close_scale);
            }
        }

        super.init();

		SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();
		WebViewClient customWebViewClient = new CustomWebviewClient(systemWebViewEngine, this);

		WebView webView = (WebView) systemWebViewEngine.getView();
		webView.setWebViewClient(customWebViewClient);

        super.loadUrl((url.matches("^(.://|javascript:)[\\s\\S]$") ? "" : "file:///android_asset/www/" + (isPluginCryptFileActive() ? "+++/" : "")) + url);

		mySwipeRefreshLayout = this.findViewById(R.id.swipeContainer);
		mySwipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.color_button_default));
		mySwipeRefreshLayout.setOnRefreshListener(
				() -> {
					appView.loadUrl("javascript:fnSwipePullRefresh();");

					new Handler().postDelayed(() -> mySwipeRefreshLayout.setRefreshing(false), 1000);
				}
		);
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
		super.onStop();
	}

    @SuppressWarnings({"deprecation", "ResourceType", "InflateParams"})
    @Override
    protected void createViews() {

        // Main container layout
        LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View main = inflater.inflate(R.layout.main, null);

        main.findViewById(R.id.footer).setVisibility(View.GONE);
        main.findViewById(R.id.splash_screen).setVisibility(View.GONE);

        if (title != null && !title.isEmpty()) {
            main.findViewById(R.id.iv_menu).setVisibility(View.GONE);
            main.findViewById(R.id.iv_back).setVisibility(View.VISIBLE);

            main.findViewById(R.id.btn_header_left).setOnClickListener(v -> fnClose());

            TextView tvTitle = main.findViewById(R.id.tv_title);
            tvTitle.setText(title);

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                Typeface typeface = ResourcesCompat.getFont(this, R.font.noto_sans_kr_black_);
                tvTitle.setTypeface(typeface);
            }

            main.findViewById(R.id.ll_title).setVisibility(View.GONE);
            tvTitle.setVisibility(View.VISIBLE);
        } else {
            main.findViewById(R.id.header).setVisibility(View.GONE);
        }

        appView.getView().setId(200);
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

    public void fnClose() {
		CommonUtils.hideLoader(activity2);
		finish();
    }

    @Override
    public void onPause() {
        super.onPause();

        if (animType != null && animType.equals("from_left")) {
            overridePendingTransition(R.anim.slide_from_right, R.anim.slide_to_left);
        } else {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                overridePendingTransition(R.anim.activity_open_scale, R.anim.activity_close_translate);
            }
        }
    }

    @Override
    public void onBackPressed() {
        fnGoBack(null);
    }

    public void fnGoBack(View v) {
        try {
            if (appView.canGoBack()) {
                appView.backHistory();
            } else {
                fnClose();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Revisa si existe el plugin cordova-plugin-crypt-file
     *
     * @return boolean
     */
    private boolean isPluginCryptFileActive() {
        try {
            Class.forName("com.tkyaji.cordova.DecryptResource");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
