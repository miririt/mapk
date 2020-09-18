package net.miririt.mapk

import android.content.Context
import android.net.Uri
import android.webkit.WebView
import androidx.documentfile.provider.DocumentFile
import java.io.ByteArrayOutputStream
import java.io.InputStream

fun loadAsset(context: Context, inFile: String): String {
    return try {
        val stream: InputStream = context.assets.open(inFile)
        val result = ByteArrayOutputStream()
        val buffer = ByteArray(1024)
        var length: Int
        while (stream.read(buffer).also { length = it } != -1) {
            result.write(buffer, 0, length)
        }
        result.toString("UTF-8")
    } catch (e: Exception) {
        // Handle exceptions here
        ""
    }
}

fun makeWebViewCompatible(context: Context, view: WebView) {
    view.addJavascriptInterface(FileSystemInterface(context), "_NJSFileSystemInterface")
}

fun afterWebView(context: Context, view: WebView) {
    if(!view.url?.contains("appassets.androidplatform.net")!!) return

    val jsFeature = loadAsset(context, "mapk/feature.js")
    val jsInject = loadAsset(context, "mapk/inject.js")
    val jsSimpleCheat = loadAsset(context, "mapk/cheat.js")

    view.evaluateJavascript(jsFeature) {
        view.evaluateJavascript("pluginFix();", null)
        view.evaluateJavascript("smoothUpdate();", null)
        view.evaluateJavascript("ignoreError();", null)
    }

    // Apply Additional plugin injectorv
    view.evaluateJavascript(jsInject) {
        view.evaluateJavascript("injectCheatMenu();", null)
        view.evaluateJavascript("injectKeyboard();", null)
        view.evaluateJavascript("toggleOnTop();", null)
    }

    // Apply Back key menu
    view.evaluateJavascript(jsSimpleCheat, null)
}