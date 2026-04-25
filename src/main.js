const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#333333',
    scene: [BootScene, StartMenu, HowToPlay, MainGame, LevelClear, FinalClear, GameOver]
};

window.onload = () => {
    window.game = new Phaser.Game(config);
};
