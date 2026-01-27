// 游戏状态
const gameState = {
    hp: 100,
    maxHp: 100,
    level: 1,
    exp: 0,
    expToNextLevel: 30,
    gold: 10,
    attack: 10,
    location: 'town',
    enemy: null,
    gameActive: true
};

// 游戏内容
const gameContent = {
    locations: {
        town: {
            name: "村庄 🏘️",
            emoji: "🏘️",
            description: "你在一个宁静的村庄。下一步去哪里？",
            actions: [
                { text: "前往地牢 🏰", action: "goDungeon", emoji: "🏰" },
                { text: "前往商店 🛒", action: "goShop", emoji: "🛒" },
                { text: "休息恢复 ❤️", action: "rest", emoji: "❤️" }
            ]
        },
        dungeon: {
            name: "地牢入口 🏰",
            emoji: "🏰",
            description: "你在地牢入口。黑暗的通道深处传来奇怪的声音...",
            actions: [
                { text: "探索地牢 👣", action: "explore", emoji: "👣" },
                { text: "返回村庄 🏘️", action: "goTown", emoji: "🏘️" }
            ]
        },
        shop: {
            name: "商店 🛒",
            emoji: "🛒",
            description: "商店老板对你微笑。想买点什么？",
            actions: [
                { text: "购买药水 (+50HP) 💊", action: "buyPotion", cost: 20, emoji: "💊" },
                { text: "购买宝剑 (+5攻击) ⚔️", action: "buySword", cost: 50, emoji: "⚔️" },
                { text: "离开商店 🏘️", action: "goTown", emoji: "🏘️" }
            ]
        },
        battle: {
            name: "战斗",
            emoji: "⚔️",
            description: "你遇到了敌人！",
            actions: [
                { text: "攻击 ⚔️", action: "attack", emoji: "⚔️" },
                { text: "逃跑 🏃", action: "flee", emoji: "🏃" }
            ]
        }
    }
};

// DOM元素
const gameTextEl = document.getElementById('game-text');
const emojiDisplayEl = document.getElementById('emoji-display');
const actionsEl = document.getElementById('actions');
const logContentEl = document.getElementById('log-content');
const hpBarFillEl = document.getElementById('hp-bar-fill');
const hpTextEl = document.getElementById('hp-text');

// 更新所有显示
function updateAllDisplays() {
    updateStats();
    updatePlayerDisplay();
    updateEnemyDisplay();
    updateLocationDisplay();
    updateExpDisplay();
    updateHpBar();
}

// 更新状态显示
function updateStats() {
    document.getElementById('hp').textContent = `${gameState.hp}/${gameState.maxHp}`;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('attack').textContent = gameState.attack;
}

// 更新玩家显示
function updatePlayerDisplay() {
    document.getElementById('player-level').textContent = gameState.level;
    document.getElementById('player-attack').textContent = gameState.attack;
    const playerEmojiEl = document.getElementById('player-emoji');
    if (gameState.hp > gameState.maxHp * 0.5) playerEmojiEl.textContent = '😎';
    else playerEmojiEl.textContent = '😨';
}

// 更新敌人显示
function updateEnemyDisplay() {
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyHpEl = document.getElementById('enemy-hp');
    const enemyAttackEl = document.getElementById('enemy-attack');
    const enemyEmojiEl = document.getElementById('enemy-emoji');

    if (gameState.enemy) {
        enemyNameEl.textContent = gameState.enemy.name;
        enemyHpEl.textContent = `生命: ${gameState.enemy.hp}/${gameState.enemy.maxHp}`;
        enemyAttackEl.textContent = `攻击: ${gameState.enemy.attack}`;
        enemyEmojiEl.textContent = gameState.enemy.emoji;
    } else {
        enemyNameEl.textContent = "无";
        enemyHpEl.textContent = "生命: -/-";
        enemyAttackEl.textContent = "攻击: -";
        enemyEmojiEl.textContent = "❓";
    }
}

// 更新位置显示
function updateLocationDisplay() {
    document.getElementById('current-loc').textContent = gameContent.locations[gameState.location].name;
}

// 更新经验显示
function updateExpDisplay() {
    document.getElementById('exp').textContent = `${gameState.exp}/${gameState.expToNextLevel}`;
}

// 更新血条
function updateHpBar() {
    const hpPercent = (gameState.hp / gameState.maxHp) * 100;
    hpBarFillEl.style.width = `${hpPercent}%`;
    hpTextEl.textContent = `${gameState.hp}/${gameState.maxHp}`;
}

// 添加日志
function addLog(text) {
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.textContent = `> ${text}`;
    logContentEl.appendChild(logItem);
    logContentEl.scrollTop = logContentEl.scrollHeight;
}

// 更新游戏显示
function updateDisplay() {
    const location = gameContent.locations[gameState.location];
    gameTextEl.textContent = location.description;
    emojiDisplayEl.textContent = location.emoji;

    actionsEl.innerHTML = '';

    location.actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-btn';
        button.textContent = action.text;
        button.onclick = () => handleAction(action);

        if (action.cost && gameState.gold < action.cost) {
            button.disabled = true;
        }

        actionsEl.appendChild(button);
    });

    updateAllDisplays();
}

// 处理行动
function handleAction(action) {
    if (!gameState.gameActive) return;

    switch (action.action) {
        case 'goDungeon':
            gameState.location = 'dungeon';
            addLog("你前往地牢。");
            break;
        case 'goTown':
            gameState.location = 'town';
            addLog("你返回村庄。");
            break;
        case 'goShop':
            gameState.location = 'shop';
            addLog("你进入商店。");
            break;
        case 'rest':
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + 30);
            addLog(`你休息恢复了30点生命。`);
            break;
        case 'explore':
            exploreDungeon();
            break;
        case 'buyPotion':
            if (gameState.gold >= 20) {
                gameState.gold -= 20;
                gameState.maxHp += 50;
                gameState.hp += 50;
                addLog("你购买了药水，最大生命值增加了！");
            }
            break;
        case 'buySword':
            if (gameState.gold >= 50) {
                gameState.gold -= 50;
                gameState.attack += 5;
                addLog("你购买了宝剑，攻击力增加了！");
            }
            break;
        case 'attack':
            attackEnemy();
            break;
        case 'flee':
            if (Math.random() > 0.3) {
                addLog("你成功逃跑了！");
                gameState.location = 'dungeon';
            } else {
                addLog("逃跑失败！");
                enemyAttack();
            }
            break;
    }

    updateDisplay();
}

// 探索地牢
function exploreDungeon() {
    if (Math.random() < 0.7) {
        const enemyIndex = Math.min(
            Math.floor(Math.random() * (gameState.level + 2)),
            enemies.length - 1
        );
        gameState.enemy = { ...enemies[enemyIndex] };

        gameState.location = 'battle';
        addLog(`遭遇了${gameState.enemy.name}！`);
        gameTextEl.textContent = `你遇到了${gameState.enemy.name}！`;
        emojiDisplayEl.textContent = gameState.enemy.emoji;
    } else {
        const goldFound = Math.floor(Math.random() * 30) + 10;
        gameState.gold += goldFound;
        addLog(`你找到了${goldFound}枚金币！`);
        gameTextEl.textContent = `你探索地牢，找到了${goldFound}枚金币！`;
        emojiDisplayEl.textContent = "💰";
    }
    updateNextEnemyPrediction();
}

// 攻击敌人
function attackEnemy() {
    if (!gameState.enemy) return;

    const playerDamage = Math.floor(Math.random() * 10) + gameState.attack;
    gameState.enemy.hp -= playerDamage;
    addLog(`你对${gameState.enemy.name}造成了${playerDamage}点伤害！`);

    if (gameState.enemy.hp <= 0) {
        addLog(`你击败了${gameState.enemy.name}！`);
        addLog(`获得${gameState.enemy.exp}经验值和${gameState.enemy.gold}金币！`);

        gameState.gold += gameState.enemy.gold;
        gameState.exp += gameState.enemy.exp;

        if (gameState.exp >= gameState.expToNextLevel) {
            levelUp();
        }

        gameState.enemy = null;
        gameState.location = 'dungeon';
    } else {
        enemyAttack();
    }

    updateAllDisplays();
}

// 敌人攻击
function enemyAttack() {
    if (!gameState.enemy) return;

    const enemyDamage = Math.floor(Math.random() * 10) + gameState.enemy.attack;
    gameState.hp -= enemyDamage;
    addLog(`${gameState.enemy.name}对你造成了${enemyDamage}点伤害！`);

    if (gameState.hp <= 0) {
        gameState.hp = 0;
        addLog("你被击败了！");

        const lostGold = Math.floor(gameState.gold / 2);
        gameState.gold = Math.max(1, gameState.gold - lostGold);
        addLog(`你失去了${lostGold}枚金币！`);

        gameState.hp = gameState.maxHp;
        addLog("你在村庄满血复活了！");

        gameState.location = 'town';
        gameState.enemy = null;

        gameTextEl.textContent = "你被击败后回到了村庄，金币损失了一半。";
        emojiDisplayEl.textContent = "🏘️";
    } else {
        gameTextEl.textContent = `${gameState.enemy.name} (HP: ${gameState.enemy.hp})`;
    }

    updateAllDisplays();
}

// 升级
function levelUp() {
    gameState.level++;
    gameState.exp = 0;
    gameState.expToNextLevel = Math.floor(gameState.expToNextLevel * 1.5);
    gameState.maxHp += 20;
    gameState.hp = gameState.maxHp;
    gameState.attack += 5;

    addLog(`恭喜！你升到了${gameState.level}级！`);
    addLog(`生命值+20，攻击力+5！`);

    updateNextEnemyPrediction();
}

// 更新下一个敌人预测
function updateNextEnemyPrediction() {
    const nextEnemyIndex = Math.min(gameState.level, enemies.length - 1);
    document.getElementById('next-enemy').textContent = enemies[nextEnemyIndex].name;
}

// === 存档系统 ===

// 快速保存到localStorage
function quickSave() {
    localStorage.setItem('emojiRPG_save', JSON.stringify(gameState));
    addLog("游戏已保存到浏览器存储！");
}

// 快速读取从localStorage
function quickLoad() {
    const saveData = localStorage.getItem('emojiRPG_save');
    if (saveData) {
        const savedState = JSON.parse(saveData);
        Object.assign(gameState, savedState);
        addLog("已从浏览器存储读取存档！");
        updateAllDisplays();
        updateDisplay();
    } else {
        addLog("没有找到存档数据！");
    }
}

// 导出存档为文件
function exportSave() {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `emoji-rpg-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog("存档已导出为文件！");
}

// 导入存档文件
function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const saveData = JSON.parse(e.target.result);
                Object.assign(gameState, saveData);
                addLog("存档文件已导入！");
                updateAllDisplays();
                updateDisplay();
            } catch (error) {
                addLog("导入失败：文件格式错误！");
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// 重置游戏
function resetGame() {
    if (confirm("确定要重置游戏吗？")) {
        Object.assign(gameState, {
            hp: 100,
            maxHp: 100,
            level: 1,
            exp: 0,
            expToNextLevel: 30,
            gold: 10,
            attack: 10,
            location: 'town',
            enemy: null,
            gameActive: true
        });

        addLog("游戏已重置！");
        updateAllDisplays();
        updateDisplay();
    }
}

// 初始化游戏
function initGame() {
    updateNextEnemyPrediction();
    updateDisplay();
    addLog("游戏开始！");
}

// 启动游戏
initGame();