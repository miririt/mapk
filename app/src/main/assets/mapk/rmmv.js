(function() {
    try {
        // change game mode as node-webkit
        Utils.isNwjs = () => true;
        Utils.isMobileDevice = () => false;
        Utils.isAndroidChrome = () => false;

        if(Utils.RPGMAKER_NAME == "MZ") {
            _StorageInterface.changeMode("MZ");
            localStorage = localforage;
        }
    } catch(e) { console.log(e.stack); }
    try {
        StorageManager.isLocalMode = () => true;

        // localStorage fix : might not be used
        Object.getPrototypeOf(localStorage).getItem = function(key){
            try {
                return _StorageInterface.getItem(key) || null;
            } catch(e) { console.log(e.stack); }
        };

        Object.getPrototypeOf(localStorage).setItem = function(key, value) {
            _StorageInterface.setItem(key,value);
        };

        Object.getPrototypeOf(localStorage).removeItem = function(key){
            _StorageInterface.removeItem(key);
        };

        Object.getPrototypeOf(localStorage).keys = function() {
            return new Promise((resolve, reject) => {
                resolve(_StorageInterface.keys());
            });
        };
    } catch(e) { console.log(e.stack); }

    try {
        // URI-Encoding error(occurs when file name includes %) fix
        Decrypter.extToEncryptExt = function(url) {
            var ext = url.split('.').pop();
            var encryptedExt = ext;

            if(ext === "ogg") encryptedExt = ".rpgmvo";
            else if(ext === "m4a") encryptedExt = ".rpgmvm";
            else if(ext === "png") encryptedExt = ".rpgmvp";
            else encryptedExt = ext;

            try {
                var uriCheck = url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
                return decodeURI(uriCheck);
            } catch(e) {
                return encodeURI(url.slice(0, url.lastIndexOf(ext) - 1)) + encryptedExt
            }
        };
    } catch(e) {
        try {
            // URI-Encoding error(occurs when file name includes %) fix - decrypted game ver.
            WebAudio.prototype._load = function(url) {
                if (WebAudio._context) {
                    var xhr = new XMLHttpRequest();

                    try {
                        xhr.open('GET', decodeURI(url));
                    } catch(e) {
                        xhr.open('GET', encodeURI(url));
                    }

                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function() {
                        if (xhr.status < 400) {
                            this._onXhrLoad(xhr);
                        }
                    }.bind(this);
                    xhr.onerror = function() {
                        this._hasError = true;
                    }.bind(this);
                    xhr.send();
                }
            };
            Bitmap.load = function(url) {
                var bitmap = new Bitmap();
                bitmap._image = new Image();
                try {
                    bitmap._image.src = decodeURI(url);
                    bitmap._url = decodeURI(url);
                } catch(e) {
                    bitmap._image.src = encodeURI(url);
                    bitmap._url = encodeURI(url);
                }
                bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
                bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
                bitmap._isLoading = true;

                return bitmap;
            };

        } catch(e2) { console.log(e.stack, e2.stack); }
    }

    try {
        //MaldiVes Error logging
        PluginManager.onError =
        window.maldivesLogError = function(e) {
            try {
                if(e.error) {
                    console.error(e.error.stack);
                } else {
                    console.error(e.message);
                    console.error(e.filename, e.lineno);
                }
            } catch(e) { }
        }
        SceneManager.setupErrorHandlers = function() {
            window.addEventListener('error', window.maldivesLogError);
        }
        Graphics.printError = () => {};
        SceneManager.onError = SceneManager.catchException = function(e) {
            console.error(e.stack || e);
        };
    } catch(e) { console.log(e.stack); }

    try {
        // save file check method fix(to make last-saved file invisible)
        let oldCheck = DataManager.isThisGameFile.bind(DataManager);
        DataManager.isThisGameFile = function(savefileId) {
            return savefileId <= this.maxSavefiles() && oldCheck(savefileId);
        };
    } catch(e) { console.log(e.stack); }

    try {
        // for old version game : make listener non-passive
        let oldAddEventListener = document.addEventListener.bind(document);
        document.addEventListener = function(type, listener, options) {
        	if(!options) {
        		oldAddEventListener(type, listener, {passive: false});
        	} else {
        		if(options.passive == undefined)
        			options.passive = false;
        		oldAddEventListener(type, listener, options);
        	}
        };
    } catch(e) { console.log(e.stack); }

})();