function injectScript(pluginName, pluginDesc = '', pluginParam = {}) {
    try {
        if(PluginManager._scripts.contains(pluginName)) return;

        $plugins.push({"name": pluginName, "status": true, "description": pluginDesc, "parameters": pluginParam})
        PluginManager.setParameters.call(PluginManager, pluginName, pluginParam);
        PluginManager.loadScript.call(PluginManager, `${pluginName}.js`);
        PluginManager._scripts.push(pluginName);
    } catch(e) { }
}

function injectIrina() {
    injectScript('Irina_PerformanceUpgrade', '<PerformanceUpgrade> for RPG Maker MV version 1.6.2.', {
        "AnimationHue":"true",
        "BlurMenuBackground":"false",
        "BlurIntensity":"0.5",
        "EnemyHue":"true",
        "PixiContainerFlush":"true",
        "SkipUnnecessarySnapshots":"true"
    });
}

function injectCheatMenu() {
    injectScript('Cheat_Menu');
}

function injectKeyboard(toggleOnTop = false) {
    window.toggleOnTop = toggleOnTop;
    injectScript('hodgef/keyboard');
}