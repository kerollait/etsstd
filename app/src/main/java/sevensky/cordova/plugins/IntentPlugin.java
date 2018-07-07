package sevensky.cordova.plugins;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
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
            JSONObject jsonObject=new JSONObject(args.getString(2));
            int requestCode = 0;
            if (action.equals("startActivityForResult")) {
            	try {
					requestCode = args.getInt(3);
				} catch(Exception e) {

				}
			}
            Bundle bundle=new Bundle();
            for(int i = 0; i<jsonObject.names().length(); i++){
                bundle.putString(jsonObject.names().getString(i) ,
                        jsonObject.get(jsonObject.names().getString(i)).toString());
            }

            if (action.equals("startActivity")) {
				this.startActivity(appName, activityName, bundle);
			} else if (action.equals("startActivityForResult")) {
				this.startActivityForResult(appName, activityName, bundle, requestCode);
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

    @Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		Log.d("EtoosSmartStudy", "IntetPlugin - onActivityResult : requestCode = "+ requestCode +", resultCode = "+ resultCode +", activityResultOK = " + Activity.RESULT_OK);

		int REQUEST_CODE_LOGIN = 1;
		if (requestCode == REQUEST_CODE_LOGIN) {
			if (resultCode == Activity.RESULT_OK) {
				this.callbackContext.success("login_ok");
			} else {
				this.callbackContext.success("login_cancel");
			}
		}
	}
}
