package com.etoos.study;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.support.v4.content.res.ResourcesCompat;
import android.support.v7.app.AppCompatActivity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.etoos.study.common.utils.CommonUtils;
import com.etoos.study.common.utils.RecycleUtils;
import com.etoos.study.player.PlayerActivity;


public class LoginActivity extends AppCompatActivity {

	private Activity activity;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            overridePendingTransition(R.anim.activity_open_translate, R.anim.activity_close_scale);
        }

        activity = this;

        setContentView(R.layout.login);

        ImageView btnLoginClose = findViewById(R.id.btn_login_close);
        TextView loginTitle = findViewById(R.id.tv_login_title);
        final EditText editLoginId = findViewById(R.id.et_login_id);
        final EditText editLoginPwd = findViewById(R.id.et_login_pwd);
        final Button btnLoginSubmit = findViewById(R.id.btn_login_submit);
        final Button btnJoinMember = findViewById(R.id.btn_join_member);

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			Typeface typeface = ResourcesCompat.getFont(this, R.font.noto_sans_kr_black_);
			loginTitle.setTypeface(typeface);
			editLoginId.setTypeface(typeface);
			editLoginPwd.setTypeface(typeface);
			btnLoginSubmit.setTypeface(typeface);
			btnJoinMember.setTypeface(typeface);
		}

        btnLoginClose.setOnClickListener(view -> {
        	fnLoginCancel();
        });

        btnLoginSubmit.setOnClickListener(view -> {
			editLoginId.setEnabled(false);
			editLoginPwd.setEnabled(false);
			btnLoginSubmit.setEnabled(false);
			btnJoinMember.setEnabled(false);

			CommonUtils.showLoader(activity);

			final Handler handler = new Handler();
			handler.postDelayed(() -> {
				CommonUtils.hideLoader(activity);

				Intent i = new Intent();
				setResult(Activity.RESULT_OK, i);
				finish();
			}, 2000);
        });

        btnJoinMember.setOnClickListener(view -> {

			String url = "http://redirector.c.youtube.com/videoplayback?id=604ed5ce52eda7ee&itag=22&source=youtube&sparams=ip,ipbits,expire,source,id&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=513F28C7FDCBEC60A66C86C9A393556C99DC47FB.04C88036EEE12565A1ED864A875A58F15D8B5300&key=ik0";
			Uri uri = Uri.parse(url);

			Intent i = new Intent(this, PlayerActivity.class);
			i.setData(uri);
			i.setAction(PlayerActivity.ACTION_VIEW);
			startActivity(i);
		});
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            overridePendingTransition(R.anim.activity_open_scale, R.anim.activity_close_translate);
        }
    }

	@Override
	public void onDestroy() {
		super.onDestroy();

		RecycleUtils.recursiveRecycle(getWindow().getDecorView());
		RecycleUtils.gc();
	}

	@Override
	public void onBackPressed() {
		fnLoginCancel();
	}

	private void fnLoginCancel() {
		Intent i = new Intent();
		setResult(Activity.RESULT_CANCELED, i);
		finish();
	}
}