
function multiplyGold() {
    $gameParty.gainGold($gameParty._gold);
}

function changeMovementSpeed() {
    $gamePlayer._moveSpeed = 3 + ($gamePlayer._moveSpeed - 2) % 4;
}

function togglePassWall() {
    $gamePlayer._through = !$gamePlayer._through;
}

function exhaustEnemy() {
    $gameTroop.members().filter(_ => _).forEach(_ => _.setHp(1));
}

(function() {
    try {
        let oldStartBattle = BattleManager.startBattle.bind(BattleManager);
        BattleManager.startBattle = (function() {
            oldStartBattle();
            if(window.skipBattle) {
                this.processVictory();
            }
        }).bind(BattleManager);
    } catch(e) { alert(e); }
})();

function toggleBattleSkip() {
    window.skipBattle = !window.skipBattle;
}

function toggleRandomEncounter() {
    $gamePlayer._encounterCount = $gamePlayer._encounterCount > 2**30 ? 30 : 2**32;
}