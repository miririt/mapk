package net.miririt.mapk

import android.content.Context
import android.os.SystemClock
import android.view.MotionEvent
import android.webkit.*
import androidx.webkit.WebViewAssetLoader
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.SequenceInputStream

open class RMMVClient(private val context: Context) :
    WebViewClient() {

    companion object {
        val ASSET_INJECT = arrayOf( // inject asset file "as is"
            "/plugins/Irina_PerformanceUpgrade.js",
            "/plugins/Cheat_Menu.js",
            "/plugins/Cheat_Menu.css",
            "/hodgef/keyboard.js",
            "/hodgef/keyboard.css",
            "/fonts/nanumbarunpenR.eot",
            "/fonts/nanumbarunpenR.woff",
            "/fonts/nanumbarunpenR.woff2"
        )

        val DEFAULT_HEADERS = HashMap<String, String>()

        init {
            DEFAULT_HEADERS["Access-Control-Allow-Origin"] = "*"
            DEFAULT_HEADERS["Access-Control-Allow-Headers"] =
                System.getProperty("AccessControlAllowHeader", "origin,accept,content-type") ?: ""
            DEFAULT_HEADERS["Access-Control-Allow-Credentials"] = "true"
            DEFAULT_HEADERS["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD"
            DEFAULT_HEADERS["Access-Control-Max-Age"] = "151200"
        }
    }

    private val assetLoader : WebViewAssetLoader = WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
        .build()

    private fun concatStream(vararg streams: InputStream?) : SequenceInputStream {
        var result = SequenceInputStream(streams[0], streams[1])
        var streamCnt = 2
        while(streamCnt < streams.size) {
            result = SequenceInputStream(result, streams[streamCnt])
            streamCnt++
        }
        return result
    }

    private fun streamResponse(url: String, stream: InputStream?) : WebResourceResponse {
        val response = WebResourceResponse(MimeUtils.getMimeType(url), "utf8", stream)
        response.responseHeaders = DEFAULT_HEADERS
        return response
    }

    private fun stringStream(str: String) : ByteArrayInputStream {
        return ByteArrayInputStream(str.toByteArray())
    }

    override fun onPageFinished(webView: WebView, str: String) {
        super.onPageFinished(webView, str)

        val uptimeMillis = SystemClock.uptimeMillis()
        webView.dispatchTouchEvent(MotionEvent.obtain(uptimeMillis, uptimeMillis, MotionEvent.ACTION_DOWN, 0f, 0f, 0))
        webView.dispatchTouchEvent(MotionEvent.obtain(uptimeMillis, uptimeMillis, MotionEvent.ACTION_DOWN, 0f, 0f, 0))

        afterWebView(context, webView)
    }

    override fun shouldInterceptRequest (view: WebView,
                                         request: WebResourceRequest
    ) : WebResourceResponse? {

        val path = request.url.path!!.replace("https://appassets.androidplatform.net/assets/", "")

        // Inject assets
        ASSET_INJECT.find{ item -> path.endsWith(item) }?.let {
            return streamResponse(path, context.assets?.open("mapk$it"))
        }

        // Inject main.js
        if(path == "/js/rpg_core.js") {
            return streamResponse(
                path,
                concatStream(
                    context.assets?.open("mapk/compat.js"),
                    context.assets?.open("www/js/rpg_core.js")
                )
            )
        }

        // Inject main.js
        if(path == "/js/main.js") {
            return streamResponse(
                path,
                concatStream(
                    context.assets?.open("mapk/rmmv.js"),
                    context.assets?.open("www/js/main.js"),
                    stringStream("SceneManager.exit = () => {};")
                )
            )
        }

        return assetLoader.shouldInterceptRequest(request.url)
    }
}

class RMMVChromeClient :
    WebChromeClient() {

    override fun onJsAlert(
        view: WebView?,
        url: String?,
        message: String?,
        result: JsResult?
    ): Boolean {
        // Ignore Alert
        return true
    }
}