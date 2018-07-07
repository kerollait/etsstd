package com.etoos.study.common.utils;

import android.annotation.TargetApi;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;

public class RecycleUtils {

	private RecycleUtils() {
	}

	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	@SuppressWarnings("deprecation")
	public static void recursiveRecycle(View root) {
		if (root == null)
			return;

		root.setBackground(null);

		if (root instanceof ViewGroup) {

			ViewGroup group = (ViewGroup) root;

			int count = group.getChildCount();

			for (int i = 0; i < count; i++) {

				recursiveRecycle(group.getChildAt(i));

			}

			if (!(root instanceof AdapterView)) {

				group.removeAllViews();

			}

		}

		if (root instanceof ImageView) {

			((ImageView) root).setImageDrawable(null);

		}

		root = null;

		return;

	}

	public static void gc() {
		if (System.getProperty("java.vm.version").compareTo("2.0.0") < 0) {
			System.gc();
		}
	}
}

