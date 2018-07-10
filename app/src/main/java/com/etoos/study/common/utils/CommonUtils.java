package com.etoos.study.common.utils;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.airbnb.lottie.LottieAnimationView;
import com.etoos.study.R;

public class CommonUtils {

	public static Dialog loaderDialog = null;

    /**
     * This method converts dp unit to equivalent pixels, depending on device density.
     *
     * @param dp      A value in dp (density independent pixels) unit. Which we need to convert into pixels
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent px equivalent to dp depending on device density
     */

    public static float convertDpToPixel(float dp, Context context) {

        Resources resources = context.getResources();

        DisplayMetrics metrics = resources.getDisplayMetrics();

        float px = dp * (metrics.densityDpi / 160f);

        return px;

    }


    /**
     * This method converts device specific pixels to density independent pixels.
     *
     * @param px      A value in px (pixels) unit. Which we need to convert into db
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent dp equivalent to px value
     */

    public static float convertPixelsToDp(float px, Context context) {

        Resources resources = context.getResources();

        DisplayMetrics metrics = resources.getDisplayMetrics();

        float dp = px / (metrics.densityDpi / 160f);

        return dp;

    }


    public synchronized static void showLoader(Activity activity) {
		activity.runOnUiThread(() -> {
			if (loaderDialog == null) {
				/*loaderDialog = new Dialog(activity, R.style.LoadingDialogTheme);
				ProgressBar progressBar = new ProgressBar(activity,null, android.R.attr.progressBarStyle);

				LinearLayout linearLayout = new LinearLayout(activity);
				linearLayout.setOrientation(LinearLayout.VERTICAL);
				RelativeLayout layoutPrincipal = new RelativeLayout(activity);

				RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
				params.addRule(RelativeLayout.CENTER_IN_PARENT);

				linearLayout.addView(progressBar);

				linearLayout.setLayoutParams(params);

				layoutPrincipal.addView(linearLayout);

				loaderDialog.setContentView(layoutPrincipal);
				loaderDialog.setOnCancelListener(dialogInterface -> {

				});
				loaderDialog.setOnKeyListener((dialogInterface, i, keyEvent) -> {
					if(keyEvent.getKeyCode() == KeyEvent.KEYCODE_BACK) {
						loaderDialog.dismiss();
						loaderDialog = null;
						return true;
					}

					return false;
				});

				loaderDialog.show();*/

				loaderDialog = new Dialog(activity, R.style.LoadingDialogTheme);
				loaderDialog.setContentView(R.layout.loader);
				loaderDialog.setOnCancelListener(dialogInterface -> {

				});
				loaderDialog.setOnKeyListener((dialogInterface, i, keyEvent) -> {
					if (keyEvent.getKeyCode() == KeyEvent.KEYCODE_BACK) {
						loaderDialog.dismiss();
						loaderDialog = null;
						return true;
					}

					return false;
				});

				loaderDialog.show();

				LottieAnimationView loader = loaderDialog.findViewById(R.id.loader);
				loader.setVisibility(View.VISIBLE);
				loader.playAnimation();
			}
		});
    }

    public synchronized static void hideLoader(Activity activity) {
		activity.runOnUiThread(() -> {
			if (loaderDialog != null) {
				loaderDialog.dismiss();
				loaderDialog = null;
			}
		});
	}
}
