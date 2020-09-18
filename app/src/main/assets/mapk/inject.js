function injectScript(pluginName, pluginParameters = {}) {
    try {
        if(PluginManager._scripts.contains(pluginName)) return;

        $plugins.push({"name": pluginName, "stauts": true, "description": "", "parameters": pluginParameters})
        PluginManager.setParameters.call(PluginManager, pluginName, pluginParameters);
        PluginManager.loadScript.call(PluginManager, `${pluginName}.js`);
        PluginManager._scripts.push(pluginName);
    } catch(e) { }
}

function injectIrina() {
    injectScript('Irina_PerformanceUpgrade', {
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