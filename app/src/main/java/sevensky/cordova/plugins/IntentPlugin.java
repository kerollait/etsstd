package sevensky.cordova.plugins;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Ahmad on 2/3/2017.
 */
public class IntentPlugin extends CordovaPlugin {

	public CallbackContext callbackContext;

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;

        if (action.equals("startActivity") || action.equals("startActivityForResult")) {
            String appName = args.getString(0);
            String activityName = args.getString(1);
            JSONObject jsonObject = new JSONObject(args.getString(2));
            int requestCode = 0;
            if (action.equals("startActivityForResult")) {
            	try {
					requestCode = args.getInt(3);
				} catch(Exception e) {

				}
			}
            Bundle bundle = new Bundle();
            for(int i = 0; i < jsonObject.names().length(); i++){
                bundle.putString(jsonObject.names().getString(i) ,
                        jsonObject.get(jsonObject.names().getString(i)).toString());
            }

            if (action.equals("startActivity")) {
				this.startActivity(appName, activityName, bundle);
			} else if (action.equals("startActivityForResult")) {
				this.startActivityForResult(appName, activityName, bundle, requestCode);
			}
            return true;
        } else if (action.equals("finishActivity") || action.equals("finishActivityForResult")) {
			String appName = args.getString(0);
			String activityName = args.getString(1);
			JSONObject jsonObject = new JSONObject(args.getString(2));
			int resultCode = Activity.RESULT_OK;

			if (action.equals("finishActivityForResult")) {
				try {
					String resultCodeType = args.getString(4);
					if ("RESULT_OK".equals(resultCodeType.toUpperCase())) {
						resultCode = Activity.RESULT_OK;
					} else {
						resultCode = Activity.RESULT_CANCELED;
					}
				} catch(Exception e) {

				}
			}

			Bundle bundle = new Bundle();
			for(int i = 0; i < jsonObject.names().length(); i++){
				bundle.putString(jsonObject.names().getString(i) ,
						jsonObject.get(jsonObject.names().getString(i)).toString());
			}

			if (action.equals("finishActivity")) {
				this.finishActivity(appName, activityName);
			} else if (action.equals("finishActivityForResult")) {
				this.finishActivityForResult(appName, activityName, bundle, resultCode);
			}

			return true;
		}

        return false;
    }


    private void startActivity(String appName,String activityName, Bundle bundle) {
        if (appName != null && appName.length() > 0) {
            Intent intent = new Intent();
            intent.putExtras(bundle);
            intent.setComponent(new ComponentName(appName, appName+"."+activityName));
            this.cordova.getActivity().startActivity(intent);
            this.callbackContext.success(appName+"."+activityName);
        } else {
            this.callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private void finishActivity(String appName, String activityName) {
		Log.d("EtoosSmartStudy", "IntetPlugin - finishActivity : appName = "+ appName +", activityName = "+ activityName);

		if (appName != null && appName.length() > 0) {
			Log.d("EtoosSmartStudy", this.cordova.getActivity().getLocalClassName());
		}
	}

    private void startActivityForResult(String appName,String activityName, Bundle bundle, int requestCode) {
		Log.d("EtoosSmartStudy", "IntetPlugin - startActivityForResult : requestCode = "+ requestCode);
		if (appName != null && appName.length() > 0) {
			Intent intent = new Intent();
			intent.putExtras(bundle);
			intent.setComponent(new ComponentName(appName, appName+"."+activityName));
			this.cordova.setActivityResultCallback (this);
			this.cordova.getActivity().startActivityForResult(intent, requestCode);
			//this.callbackContext.success(appName+"."+activityName);
		} else {
			this.callbackContext.error("Expected one non-empty string argument.");
		}
	}

	private void finishActivityForResult(String appName, String activityName, Bundle bundle, int resultCode) {
		Log.d("EtoosSmartStudy", "IntetPlugin - finishActivityForResult : appName = "+ appName +", activityName = "+ activityName);

		if (appName != null && appName.length() > 0) {
			if (this.cordova.getActivity().getPackageName().equals(appName) && this.cordova.getActivity().getLocalClassName().equals(activityName)) {

				Intent intent = new Intent();
				intent.putExtras(bundle);
				this.cordova.getActivity().setResult(resultCode, intent);
				this.cordova.getActivity().finish();
			}
		}
	}

    @Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		int REQUEST_CODE_LOGIN = 1;

		Log.d("EtoosSmartStudy", "IntentPlugin - onActivityResult resultCode : "+ resultCode + ", requestCode = "+ requestCode +", intent = "+ intent.getExtras());

		if (requestCode == REQUEST_CODE_LOGIN) {
			JSONObject r = new JSONObject();

			if (resultCode == Activity.RESULT_OK) {
				try {
					r.put("login_state", "ok");
				} catch (JSONException e) {
					e.printStackTrace();
				}

				this.callbackContext.success(r);
			} else if (resultCode == Activity.RESULT_CANCELED) {
				try {
					r.put("login_state", "cancel");
				} catch (JSONException e) {
					e.printStackTrace();
				}

				this.callbackContext.success(r);
			}
		}
	}
}
