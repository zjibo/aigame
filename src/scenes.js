class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() { }
    create() { this.scene.start('StartMenu'); }
}

class StartMenu extends Phaser.Scene {
    constructor() { super('StartMenu'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, '倒药水游戏', { fontSize: '48px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5);

        const playBtn = this.add.text(width/2, height/2, '开始游戏', { fontSize: '32px', fill: '#0f0', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        playBtn.on('pointerdown', () => this.scene.start('MainGame', { level: 1 }));

        const helpBtn = this.add.text(width/2, height/2 + 60, '游戏规则', { fontSize: '32px', fill: '#ff0', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        helpBtn.on('pointerdown', () => this.scene.start('HowToPlay'));
    }
}

class HowToPlay extends Phaser.Scene {
    constructor() { super('HowToPlay'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, 100, '游戏规则', { fontSize: '48px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5);

        const instructions = [
            "1. 点击一个瓶子选中它。",
            "2. 点击另一个瓶子倒入药水。",
            "3. 只有当顶部药水颜色相同",
            "   或者目标瓶子为空时才能倒入。",
            "4. 将一个瓶子装满4层相同颜色的药水",
            "   就可以获得一颗星星。",
            "5. 在时间结束前收集足够的星星！",
            "6. '?' 代表隐藏的药水，上面被倒空后才会显示。"
        ];
        this.add.text(width/2, height/2 + 20, instructions, { fontSize: '24px', fill: '#ccc', align: 'center', fontFamily: 'sans-serif', lineSpacing: 10 }).setOrigin(0.5);

        const backBtn = this.add.text(width/2, height - 100, '返回', { fontSize: '32px', fill: '#f00', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => this.scene.start('StartMenu'));
    }
}

class LevelClear extends Phaser.Scene {
    constructor() { super('LevelClear'); }
    init(data) { this.nextLevel = data.level + 1; }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, '通关成功！', { fontSize: '48px', fill: '#0f0', fontFamily: 'sans-serif' }).setOrigin(0.5);

        const nextBtn = this.add.text(width/2, height/2, '下一关', { fontSize: '32px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        nextBtn.on('pointerdown', () => {
            this.scene.start('MainGame', { level: this.nextLevel });
        });
    }
}

class FinalClear extends Phaser.Scene {
    constructor() { super('FinalClear'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, '恭喜你！\n你通关了所有游戏！', { fontSize: '48px', fill: '#0f0', align: 'center', fontFamily: 'sans-serif' }).setOrigin(0.5);

        const playBtn = this.add.text(width/2, height/2 + 50, '再玩一次', { fontSize: '32px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        playBtn.on('pointerdown', () => this.scene.start('StartMenu'));
    }
}

class GameOver extends Phaser.Scene {
    constructor() { super('GameOver'); }
    init(data) { this.level = data.level; }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, '时间到！\n游戏结束', { fontSize: '48px', fill: '#f00', align: 'center', fontFamily: 'sans-serif' }).setOrigin(0.5);

        const retryBtn = this.add.text(width/2, height/2 + 50, '再试一次', { fontSize: '32px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5).setInteractive();
        retryBtn.on('pointerdown', () => this.scene.start('MainGame', { level: this.level }));
    }
}
