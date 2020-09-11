(function() {
    try {
        // change game mode as node-webkit
        Utils.isNwjs = () => true;
        Utils.isMobileDevice = () => false;
        Utils.isAndroidChrome = () => false;

        if(Utils.RPGMAKER_NAME == "MZ") {
            _StorageInterface.changeMode("MZ");
            localStorage = localforage
        }
    } catch(e) { alert(e.stack); }
    try {
        StorageManager.isLocalMode = () => true;

        // localStorage fix : might not be used
        Object.getPrototypeOf(localStorage).getItem = function(key){
            try {
                return _StorageInterface.getItem(key) || null;
            } catch(e) { alert(e.stack); }
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

        // For games which cannot recognize its save file
        DataManager.isThisGameFile = function(savefileId) {
            if (savefileId > this.maxSavefiles()) {
                return false;
            } else {
                return !!DataManager.loadGlobalInfo()[savefileId];
            }
        };
    } catch(e) { alert(e.stack); }
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
                decodeURI(uriCheck);
                return decodeURI(uriCheck);
            } catch(e) {
                return encodeURI(url.slice(0, url.lastIndexOf(ext) - 1)) + encryptedExt
            }
        };
    } catch(e) {
        try {

            WebAudio.prototype._load = function(url) {
                if (WebAudio._context) {
                    var xhr = new XMLHttpRequest();

                    try {
                        xhr.open('GET', decodeURI(url));
                    } catch(e) {
                        xhr.open('GET', encodeURI(url));
                    }

                    xhr.open('GET', url);
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
                var bitmap = Object.create(Bitmap.prototype);
                bitmap._defer = true;
                bitmap.initialize();
            
                bitmap._decodeAfterRequest = true;

                try {
                    bitmap._requestImage(decodeURI(url));
                } catch(e) {
                    bitmap._requestImage(encodeURI(url));
                }
            
                return bitmap;
            };

        } catch(e2) { alert(e.stack, e2.stack); }
    }

    try {
        SceneManager.onError = SceneManager.catchException = function(e) {
            alert(e.stack);
        };
    } catch(e) { alert(e.stack); }

})();