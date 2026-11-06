package io.github.saponjibobu.droneautofill;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class MainActivity extends Activity {
    static final String FORM_URL = "https://forms.cloud.microsoft/pages/responsepage.aspx?id=WmHdwVqJEEaE-Hdl_k5efCGTcwIP8r1Lk-ox2tEexmFUMDI2Qks0RUxRTFo5NFhUQk1YSUNYQUI2RyQlQCN0PWcu&origin=lprLink&route=shorturl";
    static final String PREFS = "drone";
    static final String KEY_CFG = "cfg";
    static final String[] VARIANTS = {"A", "B", "C", "D"};
    static final String[] DAYS = {"", "Sen", "Sel", "Rab", "Kam", "Jum"};
    static final int ACCENT = 0xFF6B5A4B;
    static final int SOFT = 0xFFEFE9E2;
    static final int BAR_BG = 0xFFF5F3F0;
    static final int TEXT = 0xFF24201C;
    static final int ERR = 0xFFB3261E;
    static final int OK = 0xFF1D6B3F;
    static final int REQ_FILE = 11;

    WebView web;
    TextView status;
    CheckBox chkEnd;
    Spinner spinVar;
    ArrayAdapter<String> varAdapter;
    LinearLayout controls;
    Button toggle;
    final Button[] dayBtns = new Button[6];
    ValueCallback<Uri[]> fileCb;
    String injectBase;
    int pendingDay = 0;
    boolean busy = false;

    int dp(int v) {
        return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
    }

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(ACCENT);
        injectBase = readAsset("defaults.js") + "\n;\n" + readAsset("drone.js");

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        web = new WebView(this);
        root.addView(web, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        root.addView(buildBar(), new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        setContentView(root);

        setupWeb();
        if (state != null) web.restoreState(state);
        if (web.getUrl() == null) web.loadUrl(FORM_URL);
    }

    View buildBar() {
        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.VERTICAL);
        bar.setBackgroundColor(BAR_BG);
        bar.setPadding(dp(8), dp(4), dp(8), dp(6));

        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        status = new TextView(this);
        status.setTextSize(13);
        status.setTextColor(TEXT);
        status.setText("Memuat form…");
        status.setPadding(dp(4), dp(2), dp(4), dp(2));
        top.addView(status, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        toggle = smallButton("Sembunyikan");
        toggle.setOnClickListener(v -> setControlsVisible(controls.getVisibility() != View.VISIBLE));
        top.addView(toggle);
        bar.addView(top);

        controls = new LinearLayout(this);
        controls.setOrientation(LinearLayout.VERTICAL);

        LinearLayout days = new LinearLayout(this);
        days.setOrientation(LinearLayout.HORIZONTAL);
        for (int d = 1; d <= 5; d++) {
            final int day = d;
            Button b = new Button(this);
            b.setText(DAYS[d]);
            b.setAllCaps(false);
            b.setTextSize(15);
            b.setMinWidth(0);
            b.setMinimumWidth(0);
            b.setOnClickListener(v -> runDay(day, false));
            days.addView(b, new LinearLayout.LayoutParams(0, dp(52), 1f));
            dayBtns[d] = b;
        }
        controls.addView(days);

        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        spinVar = new Spinner(this);
        varAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, new ArrayList<String>());
        varAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinVar.setAdapter(varAdapter);
        row.addView(spinVar, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        chkEnd = new CheckBox(this);
        chkEnd.setText("Sampai akhir");
        chkEnd.setTextSize(13);
        chkEnd.setChecked(true);
        row.addView(chkEnd);
        Button reload = smallButton("↻");
        reload.setOnClickListener(v -> {
            pendingDay = 0;
            setStatus("Memuat ulang form…", 0);
            web.loadUrl(FORM_URL);
        });
        row.addView(reload);
        Button settings = smallButton("Atur");
        settings.setOnClickListener(v -> startActivity(new Intent(this, SettingsActivity.class)));
        row.addView(settings);
        controls.addView(row);

        bar.addView(controls);
        refreshToday();
        return bar;
    }

    Button smallButton(String text) {
        Button b = new Button(this);
        b.setText(text);
        b.setAllCaps(false);
        b.setTextSize(13);
        b.setMinWidth(0);
        b.setMinimumWidth(0);
        b.setPadding(dp(10), 0, dp(10), 0);
        return b;
    }

    void setControlsVisible(boolean show) {
        controls.setVisibility(show ? View.VISIBLE : View.GONE);
        toggle.setText(show ? "Sembunyikan" : "Tampilkan");
    }

    int todayIndex() {
        int dow = Calendar.getInstance().get(Calendar.DAY_OF_WEEK);
        int idx = dow - 1;
        return idx >= 1 && idx <= 5 ? idx : 0;
    }

    String autoVariant() {
        GregorianCalendar c = new GregorianCalendar();
        c.setFirstDayOfWeek(Calendar.MONDAY);
        c.setMinimalDaysInFirstWeek(4);
        c.setTime(new Date());
        int w = c.get(Calendar.WEEK_OF_YEAR);
        return VARIANTS[(w - 1) % VARIANTS.length];
    }

    void refreshToday() {
        int today = todayIndex();
        for (int d = 1; d <= 5; d++) {
            Button b = dayBtns[d];
            boolean on = d == today;
            b.setBackgroundTintList(ColorStateList.valueOf(on ? ACCENT : SOFT));
            b.setTextColor(on ? Color.WHITE : ACCENT);
            b.setTypeface(on ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT);
        }
        int pos = spinVar.getSelectedItemPosition();
        varAdapter.clear();
        varAdapter.add("Otomatis (minggu ini: " + autoVariant() + ")");
        for (String v : VARIANTS) varAdapter.add("Variasi " + v);
        varAdapter.notifyDataSetChanged();
        spinVar.setSelection(Math.max(0, pos));
    }

    static boolean isFormHost(String host) {
        if (host == null) return false;
        host = host.toLowerCase();
        return host.equals("forms.cloud.microsoft") || host.endsWith(".forms.cloud.microsoft")
                || host.equals("forms.office.com") || host.endsWith(".forms.office.com");
    }

    void setupWeb() {
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportMultipleWindows(false);
        s.setJavaScriptCanOpenWindowsAutomatically(true);
        CookieManager cm = CookieManager.getInstance();
        cm.setAcceptCookie(true);
        cm.setAcceptThirdPartyCookies(web, true);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String sc = u.getScheme() == null ? "" : u.getScheme().toLowerCase();
                if (sc.equals("http") || sc.equals("https") || sc.equals("about") || sc.equals("data") || sc.equals("blob")) return false;
                openExternal(u);
                return true;
            }

            @Override
            public void onPageFinished(WebView v, String url) {
                CookieManager.getInstance().flush();
                Uri u = Uri.parse(url);
                String host = u.getHost() == null ? "" : u.getHost().toLowerCase();
                if (isFormHost(host) && url.toLowerCase().contains("responsepage")) {
                    if (pendingDay > 0) {
                        int d = pendingDay;
                        pendingDay = 0;
                        runDay(d, true);
                    } else if (!busy) {
                        setStatus("Form siap. Pilih hari.", 0);
                    }
                } else if (host.contains("microsoftonline") || host.startsWith("login.")) {
                    setStatus("Silakan login akun Microsoft kantor (cukup sekali).", 0);
                }
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try {
                    startActivityForResult(p.createIntent(), REQ_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCb = null;
                    toast("Tidak ada aplikasi untuk memilih foto");
                    return false;
                }
                return true;
            }
        });
    }

    void openExternal(Uri u) {
        try {
            Intent i;
            if ("intent".equalsIgnoreCase(u.getScheme())) {
                i = Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME);
                i.addCategory(Intent.CATEGORY_BROWSABLE);
                i.setComponent(null);
                i.setSelector(null);
            } else {
                i = new Intent(Intent.ACTION_VIEW, u);
            }
            startActivity(i);
        } catch (Exception e) {
            toast("Tidak bisa membuka tautan ini");
        }
    }

    void runDay(int day, boolean retry) {
        if (busy) {
            toast("Masih mengisi, tunggu sebentar");
            return;
        }
        String saved = getSharedPreferences(PREFS, MODE_PRIVATE).getString(KEY_CFG, null);
        int pos = spinVar.getSelectedItemPosition();
        String vk = pos <= 0 ? "auto" : VARIANTS[pos - 1];
        String js = "try{" + injectBase
                + "\n;window.DroneAF.setConfig(" + (saved == null ? "null" : saved) + ");"
                + "window.DroneAF.run(" + day + "," + JSONObject.quote(vk) + "," + chkEnd.isChecked() + "," + retry + ");"
                + "}catch(e){try{AndroidBridge.onStatus('Terjadi error: '+e,'err');}catch(x){}}void 0;";
        setStatus("Mengisi form (" + DAYS[day] + ")…", 0);
        web.evaluateJavascript(js, null);
    }

    void setStatus(String msg, int kind) {
        status.setText(msg);
        status.setTextColor(kind == 2 ? ERR : kind == 1 ? OK : TEXT);
    }

    void setBusy(boolean b) {
        busy = b;
        for (int d = 1; d <= 5; d++) {
            dayBtns[d].setEnabled(!b);
            dayBtns[d].setAlpha(b ? 0.5f : 1f);
        }
    }

    void toast(String m) {
        Toast.makeText(this, m, Toast.LENGTH_SHORT).show();
    }

    String readAsset(String name) {
        try (InputStream in = getAssets().open(name)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    class Bridge {
        @JavascriptInterface
        public void onStatus(String msg, String kind) {
            final int k = "err".equals(kind) ? 2 : "ok".equals(kind) ? 1 : 0;
            final String m = msg == null ? "" : msg;
            runOnUiThread(() -> setStatus(m, k));
        }

        @JavascriptInterface
        public void onBusy(boolean b) {
            runOnUiThread(() -> setBusy(b));
        }

        @JavascriptInterface
        public void reloadForm(int day) {
            runOnUiThread(() -> {
                pendingDay = day;
                web.loadUrl(FORM_URL);
            });
        }
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req == REQ_FILE && fileCb != null) {
            fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data));
            fileCb = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshToday();
    }

    @Override
    protected void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
