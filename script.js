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
    },

    enemies: [
        { name: "史莱姆 🫧", emoji: "🫧", hp: 30, attack: 5, exp: 15, gold: 5 },
        { name: "骷髅 💀", emoji: "💀", hp: 50, attack: 8, exp: 25, gold: 10 },
        { name: "哥布林 👹", emoji: "👹", hp: 70, attack: 12, exp: 40, gold: 20 },
        { name: "巫师 🧙", emoji: "🧙", hp: 100, attack: 15, exp: 60, gold: 30 },
        { name: "龙 🐉", emoji: "🐉", hp: 150, attack: 20, exp: 100, gold: 50 }
    ]
};

// DOM元素
const gameTextEl = document.getElementById('game-text');
const emojiDisplayEl = document.getElementById('emoji-display');
const actionsEl = document.getElementById('actions');
const logContentEl = document.getElementById('log-content');

// 更新状态显示
function updateStats() {
    document.getElementById('hp').textContent = `${gameState.hp}/${gameState.maxHp}`;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('attack').textContent = gameState.attack;
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
        }

        actionsEl.appendChild(button);
    });

    updateStats();
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

        case 'explore':
            exploreDungeon();
            break;

        case 'buyPotion':
            if (gameState.gold >= action.cost) {
                gameState.gold -= action.cost;
                gameState.maxHp += 50;
                gameState.hp += 50;
                addLog("你购买了药水，最大生命值增加了！");
            }
            break;

        case 'buySword':
            if (gameState.gold >= action.cost) {
                gameState.gold -= action.cost;
                gameState.attack += 5;
                addLog("你购买了宝剑，攻击力增加了！");
            }
            break;

        case 'attack':
            attackEnemy();
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
function exploreDungeon() {
    const encounterChance = Math.random();

    if (encounterChance < 0.7) {
        // 遇到敌人
        const enemyIndex = Math.min(
            Math.floor(Math.random() * (gameState.level + 2)),
            gameContent.enemies.length - 1
        );
        gameState.enemy = { ...gameContent.enemies[enemyIndex] };

        gameState.location = 'battle';
        gameTextEl.textContent = `你遇到了${gameState.enemy.name}！`;
        emojiDisplayEl.textContent = gameState.enemy.emoji;
        addLog(`遭遇了${gameState.enemy.name}！`);
    } else {
        // 找到宝藏
        const goldFound = Math.floor(Math.random() * 30) + 10;
        gameState.gold += goldFound;
        addLog(`你找到了${goldFound}枚金币！`);
        gameTextEl.textContent = `你探索地牢，找到了${goldFound}枚金币！`;
        emojiDisplayEl.textContent = "💰";
    }
}

// 攻击敌人
function attackEnemy() {
    if (!gameState.enemy) return;

    // 玩家攻击
    const playerDamage = Math.floor(Math.random() * 10) + gameState.attack;
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
}

// 敌人攻击
function enemyAttack() {
    if (!gameState.enemy) return;

    const enemyDamage = Math.floor(Math.random() * 10) + gameState.enemy.attack;
    gameState.hp -= enemyDamage;
    addLog(`${gameState.enemy.name}对你造成了${enemyDamage}点伤害！`);

    // 检查玩家是否死亡
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        addLog("你被击败了！游戏结束。");
        gameState.gameActive = false;
        gameTextEl.textContent = "你被击败了！刷新页面重新开始。";
        emojiDisplayEl.textContent = "💀";
        actionsEl.innerHTML = '<button class="action-btn" onclick="location.reload()">重新开始 🔄</button>';
    }

    // 更新敌人状态显示
    gameTextEl.textContent = `${gameState.enemy.name} (HP: ${gameState.enemy.hp})`;
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
}

// 初始化游戏
function initGame() {
    updateDisplay();
    addLog("游戏开始！点击按钮开始冒险。");
}

// 启动游戏
initGame();