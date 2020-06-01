package com.xcdemo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.android.scanner.impl.ReaderManager;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static com.xcdemo.broadcast.SystemBroadCast.SCN_CUST_ACTION_SCODE;
import static com.xcdemo.broadcast.SystemBroadCast.SCN_CUST_EX_SCODE;


public class ScanModule extends ReactContextBaseJavaModule {

    private ReaderManager readerManager;
    private int outPutMode;
    private int endCharMode;


    public ScanModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);

        readerManager = ReaderManager.getInstance();

        initScan();
    }

    @NonNull
    @Override
    public String getName() {
        return "ScanModule";
    }

    private void initScan() {
        IntentFilter intentFilter = new IntentFilter(SCN_CUST_ACTION_SCODE);
        getReactApplicationContext().registerReceiver(scanDataReceiver, intentFilter);

        // outPutMode = readerManager.getOutPutMode();
        // if (outPutMode != 2) {
        //     readerManager.setOutPutMode(2);
        // }
        // if (endCharMode != 3) {
        //     readerManager.setEndCharMode(3);
        // }
    }

    //通过RCTDeviceEventEmitter发送消息到js端
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void openScanner() {
        readerManager.beginScanAndDeocde();
    }

    @ReactMethod
    public void closeScanner(){
        readerManager.stopScanAndDecode();
    }

    private BroadcastReceiver scanDataReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(SCN_CUST_ACTION_SCODE)) {
                try {
                    String message = "";
                    message = intent.getStringExtra(SCN_CUST_EX_SCODE);
                    Log.d("ScanTest", "-------ScannerService----------message = " + message);

//                    Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();

//                    arrayAdapter.add(message);
                    WritableMap params = Arguments.createMap();
                    params.putString("ScanResult", message);
                    sendEvent(getReactApplicationContext(), "iDataScan", params);

                    readerManager.stopScanAndDecode();
//                    isScan = true;
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.e("ScannerService", e.toString());
                }
            }
        }
    };
}
