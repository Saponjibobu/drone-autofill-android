package io.github.saponjibobu.droneautofill;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

public class SettingsActivity extends Activity {
    WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(MainActivity.ACCENT);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        web.addJavascriptInterface(new Api(), "Android");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                return !"file".equals(r.getUrl().getScheme());
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/settings.html");
    }

    SharedPreferences prefs() {
        return getSharedPreferences(MainActivity.PREFS, MODE_PRIVATE);
    }

    class Api {
        @JavascriptInterface
        public String loadConfig() {
            return prefs().getString(MainActivity.KEY_CFG, "");
        }

        @JavascriptInterface
        public boolean saveConfig(String json) {
            try {
                prefs().edit().putString(MainActivity.KEY_CFG, new JSONObject(json).toString()).apply();
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void resetConfig() {
            prefs().edit().remove(MainActivity.KEY_CFG).apply();
        }

        @JavascriptInterface
        public void close() {
            runOnUiThread(SettingsActivity.this::finish);
        }
    }
}
