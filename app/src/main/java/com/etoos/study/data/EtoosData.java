package com.etoos.study.data;

import android.content.Context;
import android.content.SharedPreferences;

import static android.content.Context.MODE_PRIVATE;

public class EtoosData {

    public static String getToken(Context context) {
		SharedPreferences etoosData = context.getSharedPreferences("etoosData", MODE_PRIVATE);
		return etoosData.getString("TOKEN", "");
    }

    public static void setToken(Context context, String token) {
		SharedPreferences etoosData = context.getSharedPreferences("etoosData", MODE_PRIVATE);
		SharedPreferences.Editor editor = etoosData.edit();
		editor.putString("TOKEN", token);
		editor.apply();
    }

    public static String getGrade(Context context) {
		SharedPreferences etoosData = context.getSharedPreferences("etoosData", MODE_PRIVATE);
		return etoosData.getString("GRADE", "go3");
	}

	public static void setGrade(Context context, String grade) {
		SharedPreferences etoosData = context.getSharedPreferences("etoosData", MODE_PRIVATE);
		SharedPreferences.Editor editor = etoosData.edit();
		editor.putString("GRADE", grade);
		editor.apply();
	}

	public static void setGradeName(Context context, String gradeName) {
		SharedPreferences etoosData = context.getSharedPreferences("etoosData", MODE_PRIVATE);
		SharedPreferences.Editor editor = etoosData.edit();
		editor.putString("GRADE_NAME", gradeName);
		editor.apply();
	}
}
