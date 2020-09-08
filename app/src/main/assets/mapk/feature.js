window.smoothUpdate = function() {
    SceneManager.updateMain = (function() {
        this.updateInputData();
        this.changeScene();
        this.updateScene();
        this.renderScene();
        this.requestUpdate();
    }).bind(SceneManager);
}

window.ignoreError = function() {
    Graphics.printError = () => {};
}

let alternative = false;
function toggleAlternativeTouch() {
    function propStopper(e) {
        e.stopPropagation();
    }

    let containerDiv = document.querySelector('#container-keyboard');
    if(!containerDiv) {
        containerDiv = document.createElement('div');

        containerDiv.id = 'container-keyboard';
        containerDiv.style.position = 'absolute';
        containerDiv.style.width = '100%';
        containerDiv.style.height = '98%';
        containerDiv.style.zIndex = '9997';
        document.body.appendChild(containerDiv);
    }

    alternative = !alternative;
    if(alternative) containerDiv.addEventListener('touchstart', propStopper);
    else containerDiv.removeEventListener('touchstart', propStopper);
}

window.pluginFix = function() {
    let pluginsName = $plugins.map(_ => _.name);

    // KMS Minimap performance fix
    if(pluginsName.includes("KMS_Minimap")) {
        try {
            let oldChange = SceneManager.changeScene.bind(SceneManager);
            SceneManager.changeScene = function() {
                oldChange();
                try{
                    SceneManager
                        ._scene
                        .children[0]
                        ._minimap
                        .children
                        .filter(_ => _.updateBlink)
                        .forEach(_ => _.updateBlink = function(){});
                } catch(e) { }
            }
        } catch(e) { }
    }
    // MoviePicture plugin path fix
    if(pluginsName.includes("MoviePicture")) {
        try {
            ImageManager.getVideoFilePath = function(filename) { return filename; };
        } catch(e) { }
    }

    // YEP Equip Core fix
    if(pluginsName.includes("YEP_EquipCore")) {
        try {
            if((typeof Yanfly._loaded_YEP_EquipCore == 'undefined') || !Yanfly._loaded_YEP_EquipCore) {
                DataManager.processEquipNotetags1($dataClasses);
                DataManager.processEquipNotetags2($dataWeapons);
                DataManager.processEquipNotetags2($dataArmors);
                Yanfly._loaded_YEP_EquipCore = true;
            }
        } catch(e) { }
    }

    // YEP Enhanced TP fix
    if(pluginsName.includes("YEP_EnhancedTP")) {
        try {
            if((typeof Yanfly._loaded_YEP_EnhancedTP == 'undefined') || !Yanfly._loaded_YEP_EnhancedTP) {
                DataManager.processETPNotetags1($dataActors);
                DataManager.processETPNotetags1($dataEnemies);
                DataManager.processETPNotetags2($dataSkills);
                DataManager.processETPNotetags2($dataItems);
                DataManager.processETPNotetags3($dataSkills);
                Yanfly._loaded_YEP_EnhancedTP = true;
            }
        } catch(e) { }
    }

    // FTKR Skill Tree System fix
    if(pluginsName.includes("FTKR_SkillTreeSystem")) {
        try {
            if((typeof _STS_DatabaseLoaded == 'undefined') || !_STS_DatabaseLoaded) {
                DataManager.stsTreeListNotetags($dataActors);
                DataManager.stsTreeListNotetags($dataClasses);
                DataManager.stsItemGetSpNotetags($dataItems);
                DataManager.stsTreeDataNotetags($dataWeapons);
                DataManager.stsTreeDataNotetags($dataSkills);
                _STS_DatabaseLoaded = true;
            }
        } catch(e) { }
    }

    // DKTools plugin fix
    if(pluginsName.includes("DKTools")) {
        DKTools.IO.isLocalMode = () => true;
    }
}