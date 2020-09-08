package net.miririt.mapk

import android.content.Context
import android.webkit.JavascriptInterface
import org.json.JSONArray
import java.io.*

class FileSystemInterface(private val context: Context) {

    private val writeDir = context.getExternalFilesDir(null)

    @JavascriptInterface
    fun existsSync(path: String?): Boolean {
        if(path == null) return false
        return try {
            if(File(writeDir, path).exists()) {
                true
            } else {
                context.assets.open(path).close()
                true
            }
        } catch (ignore: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun readFileSync(path: String?, encoding: String?): String {
        if(path == null) return ""

        val targetFile = File(writeDir, path)

        return try {
            val fis = if(targetFile.exists()) FileInputStream(targetFile) else context.assets.open(path)
            val baos = ByteArrayOutputStream()
            val buffer = ByteArray(1024 * 256)
            var length: Int
            while (fis.read(buffer).also { length = it } > 0) {
                baos.write(buffer, 0, length)
            }

            fis.close()
            baos.toString(encoding ?: "utf8")
        } catch (ignore: Exception) {
            ""
        }
    }

    @JavascriptInterface
    fun writeFileSync(
        path: String?,
        data: String?,
        encoding: String?
    ): Boolean {
        if(path == null) return false

        return try {
            val targetFile = File(writeDir, path)
            val fos = FileOutputStream(targetFile)
            fos.write(data?.toByteArray(charset(encoding!!)))
            fos.close()
            true
        } catch (e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun appendFileSync(
        path: String?,
        data: String?,
        encoding: String?
    ): Boolean {
        if(path == null) return false

        return try {
            val targetFile = File(writeDir, path)
            val fos = FileOutputStream(targetFile, true)
            fos.write(data?.toByteArray(charset(encoding!!)))
            fos.close()
            true
        } catch (e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun copyFileSync(src: String?, dst: String?, mode: Int): Boolean {
        if(src == null || dst == null) return false

        val fis: InputStream?
        val fos: OutputStream?
        try {
            val targetInput = File(writeDir, src)
            val targetOutput = File(writeDir, src)
            fis = if(targetInput.exists()) FileInputStream(targetInput) else context.assets.open(src)
            fos = FileOutputStream(targetOutput)
        } catch (ignore: Exception) {
            return false
        }
        try {
            val buffer = ByteArray(1024 * 256)
            var length: Int
            while (fis.read(buffer).also { length = it } > 0) {
                fos.write(buffer, 0, length)
            }

            fis.close()
            fos.close()
        } catch (e: Exception) {
            return false
        }
        return true
    }

    @JavascriptInterface
    fun unlinkSync(path : String?) : Boolean {
        if(path == null) return false
        return try {
            val targetFile = File(writeDir, path)
            targetFile.delete()
        } catch(e : Exception) {
            false
        }
    }

    @JavascriptInterface
    fun mkdirSync(path: String?, recursive: Boolean): Boolean {
        if(path == null) return false
        return try {
            val targetDirectory = File(writeDir, path)
            if(recursive)
                targetDirectory.mkdirs()
            else
                targetDirectory.mkdir()
        } catch(e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun readdirSync(path: String?): String {
        if(path == null) return "[]"
        return try {
            val jsonFileList = JSONArray()
            val targetDirectory = File(writeDir, path)

            if(targetDirectory.exists()) {
                val listFiles = targetDirectory.listFiles()!!
                for(file in listFiles) {
                    jsonFileList.put(file.name)
                }
            } else {
                for(file in context.assets.list(path)!!) {
                    jsonFileList.put(file)
                }
            }
            jsonFileList.toString()
        } catch(e : java.lang.Exception) {
            "[]"
        }
    }

    @JavascriptInterface
    fun isFile(path: String?): Boolean {
        if(path == null) return false
        return try {
            val targetFile = File(writeDir, path)
            if(targetFile.isFile) {
                true
            } else {
                context.assets.open(path).close()
                true
            }
        } catch(e: Exception) { false }
    }

    @JavascriptInterface
    fun isDirectory(path: String?): Boolean {
        if(path == null) return false
        return try {
            val targetFile = File(writeDir, path)
            if(targetFile.isDirectory) {
                true
            } else {
                context.assets.list(path)
                true
            }
        } catch(e: Exception) { false }
    }

    @JavascriptInterface
    fun fileSize(path: String?): Long {
        if(path == null) return 0L
        return try {
            val targetFile = File(writeDir, path)
            if(targetFile.exists()) {
                if (!targetFile.isFile) 0L
                else targetFile.length()
            } else {
                context.assets.open(path).available().toLong()
            }
        } catch(e: Exception) { 0L }
    }
}