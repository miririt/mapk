package net.miririt.mapk

import java.io.InputStream
import java.net.URL
import java.util.*
import kotlin.collections.HashMap

class MimeUtils {
    companion object {
        private val MIME_TYPES = HashMap<String, String>()
        init {
            val resources =
                this::class.java.classLoader!!.getResources("META-INF/mimetypes.properties")
            while (resources.hasMoreElements()) {
                val url = resources.nextElement() as URL
                val properties = Properties()
                var stream: InputStream? = null
                try {
                    stream = url.openStream()
                    properties.load(stream)
                } finally {
                    stream?.close()
                }

                MIME_TYPES.putAll(properties as Map<String, String>)
            }
        }

        fun getMimeType(path: String) : String {
            val dot: Int = path.lastIndexOf('.')
            var mime: String? = null
            if (dot >= 0) {
                mime = MIME_TYPES[path.substring(dot + 1).toLowerCase(Locale.ROOT)]
            }
            return mime ?: "application/octet-stream"
        }
    }
}