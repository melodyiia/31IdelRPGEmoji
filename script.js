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
    gameActive: true,
    musicOn: true
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
                { text: "休息恢复 ❤️", action: "rest", emoji: "❤️" },
                { text: "训练攻击力 🏋️", action: "train", emoji: "🏋️" }
            ]
        },
        dungeon: {
            name: "地牢入口 🏰",
            emoji: "🏰",
            description: "你在地牢入口。黑暗的通道深处传来奇怪的声音...",
            actions: [
                { text: "探索地牢 👣", action: "explore", emoji: "👣" },
                { text: "深度探索 🔍", action: "deepExplore", emoji: "🔍" },
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
                { text: "购买护甲 (+30HP) 🛡️", action: "buyArmor", cost: 40, emoji: "🛡️" },
                { text: "离开商店 🏘️", action: "goTown", emoji: "🏘️" }
            ]
        },
        battle: {
            name: "战斗",
            emoji: "⚔️",
            description: "你遇到了敌人！",
            actions: [
                { text: "攻击 ⚔️", action: "attack", emoji: "⚔️" },
                { text: "强力攻击 💥", action: "strongAttack", emoji: "💥" },
                { text: "防御 🛡️", action: "defend", emoji: "🛡️" },
                { text: "逃跑 🏃", action: "flee", emoji: "🏃" }
            ]
        }
    },

    enemies: [
        { name: "史莱姆 🫧", emoji: "🫧", hp: 30, maxHp: 30, attack: 5, exp: 15, gold: 5 },
        { name: "骷髅 💀", emoji: "💀", hp: 50, maxHp: 50, attack: 8, exp: 25, gold: 10 },
        { name: "哥布林 👹", emoji: "👹", hp: 70, maxHp: 70, attack: 12, exp: 40, gold: 20 },
        { name: "巫师 🧙", emoji: "🧙", hp: 100, maxHp: 100, attack: 15, exp: 60, gold: 30 },
        { name: "龙 🐉", emoji: "🐉", hp: 150, maxHp: 150, attack: 20, exp: 100, gold: 50 }
    ]
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

    // 根据生命值改变玩家表情
    const playerEmojiEl = document.getElementById('player-emoji');
    if (gameState.hp > gameState.maxHp * 0.7) {
        playerEmojiEl.textContent = '😎';
    } else if (gameState.hp > gameState.maxHp * 0.3) {
        playerEmojiEl.textContent = '😐';
    } else {
        playerEmojiEl.textContent = '😨';
    }
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
    const location = gameContent.locations[gameState.location];
    document.getElementById('current-loc').textContent = location.name;
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

    // 根据血量改变血条颜色
    if (hpPercent > 70) {
        hpBarFillEl.style.background = 'linear-gradient(to right, #00ff00, #55ff55)';
    } else if (hpPercent > 30) {
        hpBarFillEl.style.background = 'linear-gradient(to right, #ffff00, #ffff55)';
    } else {
        hpBarFillEl.style.background = 'linear-gradient(to right, #ff0000, #ff5555)';
    }
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

    // 清空行动按钮
    actionsEl.innerHTML = '';

    // 创建行动按钮
    location.actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-btn';
        button.textContent = action.text;
        button.onclick = () => handleAction(action);

        // 检查是否有足够金币
        if (action.cost && gameState.gold < action.cost) {
            button.disabled = true;
            button.title = `需要 ${action.cost} 金币`;
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
            const heal = 30;
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + heal);
            addLog(`你休息恢复了${heal}点生命。`);
            break;

        case 'train':
            if (gameState.gold >= 15) {
                gameState.gold -= 15;
                gameState.attack += 2;
                addLog("你训练了攻击力，攻击+2！");
            } else {
                addLog("金币不足，无法训练！");
            }
            break;

        case 'explore':
            exploreDungeon(false);
            break;

        case 'deepExplore':
            exploreDungeon(true);
            break;

        case 'buyPotion':
            if (gameState.gold >= action.cost) {
                gameState.gold -= action.cost;
                gameState.maxHp += 50;
                gameState.hp += 50;
                addLog("你购买了药水，最大生命值增加了！");
            } else {
                addLog("金币不足！");
            }
            break;

        case 'buySword':
            if (gameState.gold >= action.cost) {
                gameState.gold -= action.cost;
                gameState.attack += 5;
                addLog("你购买了宝剑，攻击力增加了！");
            } else {
                addLog("金币不足！");
            }
            break;

        case 'buyArmor':
            if (gameState.gold >= action.cost) {
                gameState.gold -= action.cost;
                gameState.maxHp += 30;
                gameState.hp += 30;
                addLog("你购买了护甲，最大生命值增加了！");
            } else {
                addLog("金币不足！");
            }
            break;

        case 'attack':
            attackEnemy(false);
            break;

        case 'strongAttack':
            attackEnemy(true);
            break;

        case 'defend':
            addLog("你采取了防御姿态！");
            // 防御效果：减少下一次受到的伤害
            setTimeout(() => {
                addLog("防御效果消失。");
            }, 2000);
            enemyAttack(0.5); // 减少50%伤害
            break;

        case 'flee':
            const fleeChance = Math.random();
            if (fleeChance > 0.3) {
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
function exploreDungeon(deep = false) {
    const encounterChance = deep ? 0.9 : 0.7;

    if (Math.random() < encounterChance) {
        // 遇到敌人
        let enemyIndex;
        if (deep) {
            enemyIndex = Math.min(
                Math.floor(Math.random() * (gameState.level + 3)),
                gameContent.enemies.length - 1
            );
        } else {
            enemyIndex = Math.min(
                Math.floor(Math.random() * (gameState.level + 2)),
                gameContent.enemies.length - 1
            );
        }

        gameState.enemy = { ...gameContent.enemies[enemyIndex] };
        gameState.enemy.hp = gameState.enemy.maxHp; // 重置敌人血量

        gameState.location = 'battle';
        const action = deep ? "深度探索" : "探索";
        addLog(`${action}时遭遇了${gameState.enemy.name}！`);
        gameTextEl.textContent = `你遇到了${gameState.enemy.name}！`;
        emojiDisplayEl.textContent = gameState.enemy.emoji;
    } else {
        // 找到宝藏
        const goldMin = deep ? 20 : 10;
        const goldMax = deep ? 50 : 30;
        const goldFound = Math.floor(Math.random() * (goldMax - goldMin + 1)) + goldMin;
        gameState.gold += goldFound;

        const action = deep ? "深度探索" : "探索";
        addLog(`${action}地牢，找到了${goldFound}枚金币！`);
        gameTextEl.textContent = `你${action}地牢，找到了${goldFound}枚金币！`;
        emojiDisplayEl.textContent = "💰";
    }

    // 更新下一个敌人预测
    updateNextEnemyPrediction();
}

// 攻击敌人
function attackEnemy(strong = false) {
    if (!gameState.enemy) return;

    // 玩家攻击
    let playerDamage;
    if (strong) {
        playerDamage = Math.floor(Math.random() * 15) + gameState.attack + 5;
        addLog("你使用了强力攻击！");
    } else {
        playerDamage = Math.floor(Math.random() * 10) + gameState.attack;
    }

    gameState.enemy.hp -= playerDamage;
    addLog(`你对${gameState.enemy.name}造成了${playerDamage}点伤害！`);

    // 检查敌人是否被击败
    if (gameState.enemy.hp <= 0) {
        addLog(`你击败了${gameState.enemy.name}！`);
        addLog(`获得${gameState.enemy.exp}经验值和${gameState.enemy.gold}金币！`);

        gameState.gold += gameState.enemy.gold;
        gameState.exp += gameState.enemy.exp;

        // 检查是否升级
        if (gameState.exp >= gameState.expToNextLevel) {
            levelUp();
        }

        // 返回地牢
        gameState.enemy = null;
        gameState.location = 'dungeon';
    } else {
        // 敌人反击
        enemyAttack();
    }

    updateAllDisplays();
}

// 敌人攻击
function enemyAttack(defenseMultiplier = 1) {
    if (!gameState.enemy) return;

    const enemyDamage = Math.floor(Math.random() * 10 + gameState.enemy.attack) * defenseMultiplier;
    gameState.hp -= Math.max(1, Math.floor(enemyDamage));
    addLog(`${gameState.enemy.name}对你造成了${Math.floor(enemyDamage)}点伤害！`);

    // 检查玩家是否死亡
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        addLog("你被击败了！游戏结束。");
        gameState.gameActive = false;
        gameTextEl.textContent = "你被击败了！";
        emojiDisplayEl.textContent = "💀";
        actionsEl.innerHTML = '<button class="action-btn" onclick="resetGame()">重新开始 🔄</button>';
    }

    // 更新敌人状态显示
    gameTextEl.textContent = `${gameState.enemy.name} (HP: ${gameState.enemy.hp})`;

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

    // 更新下一个敌人预测
    updateNextEnemyPrediction();
}

// 更新下一个敌人预测
function updateNextEnemyPrediction() {
    const nextEnemyIndex = Math.min(gameState.level, gameContent.enemies.length - 1);
    const nextEnemy = gameContent.enemies[nextEnemyIndex];
    document.getElementById('next-enemy').textContent = nextEnemy.name;
}

// 控制函数
function quickSave() {
    localStorage.setItem('emojiRPG_save', JSON.stringify(gameState));
    addLog("游戏已保存！");
}

function quickLoad() {
    const saveData = localStorage.getItem('emojiRPG_save');
    if (saveData) {
        Object.assign(gameState, JSON.parse(saveData));
        addLog("游戏已读取！");
        updateAllDisplays();
        updateDisplay();
    } else {
        addLog("没有找到保存数据！");
    }
}

function resetGame() {
    if (confirm("确定要重置游戏吗？所有进度将丢失！")) {
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
            gameActive: true,
            musicOn: true
        });

        addLog("游戏已重置！");
        updateAllDisplays();
        updateDisplay();
    }
}

function toggleMusic() {
    gameState.musicOn = !gameState.musicOn;
    const musicBtn = document.querySelector('.control-btn[onclick="toggleMusic()"]');
    musicBtn.textContent = `🎵 音效: ${gameState.musicOn ? '开' : '关'}`;
    addLog(`音效${gameState.musicOn ? '开启' : '关闭'}`);
}

// 初始化游戏
function initGame() {
    updateNextEnemyPrediction();
    updateDisplay();
    addLog("游戏开始！点击按钮开始冒险。");
}

// 启动游戏
initGame();