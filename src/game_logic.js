class MainGame extends Phaser.Scene {
    constructor() { super('MainGame'); }

    init(data) {
        this.level = data.level || 1;
        this.maxSegments = 4;
        this.timeLeft = 180; // 3 minutes
        this.stars = 0;
        this.selectedBottle = null;
        this.isPouring = false;
        this.invalidMoves = 0;

        // Colors mapping
        this.colorMap = {
            'R': 0xff0000,
            'G': 0x00ff00,
            'B': 0x0000ff,
            'Y': 0xffff00,
            'P': 0x800080,
            'C': 0x00ffff,
            'O': 0xffa500,
            'Pi': 0xffc0cb,
            'L': 0x32cd32,
            'Br': 0x8b4513,
            'T': 0x008080,
            'N': 0x000080,
            '?': 0x888888
        };
    }

    create() {
        const { width, height } = this.scale;

        // Load Level Data
        this.loadLevelData();

        // UI
        this.timerText = this.add.text(20, 20, `时间: ${this.formatTime(this.timeLeft)}`, { fontSize: '24px', fill: '#fff', fontFamily: 'sans-serif' });
        this.levelText = this.add.text(width / 2, 20, `第 ${this.level} 关`, { fontSize: '32px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(0.5, 0);
        this.starsText = this.add.text(width - 20, 20, `星星: ${this.stars}/${this.starGoal}`, { fontSize: '24px', fill: '#fff', fontFamily: 'sans-serif' }).setOrigin(1, 0);

        // Timer Event
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Draw Bottles
        this.drawBottles();

        // Restart Button
        const restartBtn = this.add.text(width / 2, 60, '重新开始', { fontSize: '20px', fill: '#0f0', fontFamily: 'sans-serif' }).setOrigin(0.5, 0).setInteractive();
        restartBtn.on('pointerdown', () => this.scene.start('MainGame', { level: this.level }));
    }

    loadLevelData() {
        if (this.level === 1) {
            this.starGoal = 3;
            this.bottlesData = [
                [{color:'R', hidden:false}, {color:'G', hidden:false}, {color:'B', hidden:false}, {color:'R', hidden:false}],
                [{color:'G', hidden:false}, {color:'B', hidden:false}, {color:'R', hidden:false}, {color:'G', hidden:false}],
                [{color:'B', hidden:false}, {color:'R', hidden:false}, {color:'G', hidden:false}, {color:'B', hidden:false}],
                []
            ];
        } else if (this.level === 2) {
            this.starGoal = 4;
            this.bottlesData = [
                [{color:'R', hidden:true}, {color:'G', hidden:false}, {color:'B', hidden:false}, {color:'Y', hidden:false}],
                [{color:'Y', hidden:true}, {color:'B', hidden:false}, {color:'G', hidden:false}, {color:'R', hidden:false}],
                [{color:'G', hidden:false}, {color:'Y', hidden:false}, {color:'R', hidden:false}, {color:'B', hidden:false}],
                [{color:'B', hidden:false}, {color:'R', hidden:false}, {color:'Y', hidden:false}, {color:'G', hidden:false}],
                []
            ];
        } else if (this.level === 3) {
            this.starGoal = 5;
            this.bottlesData = [
                [{color:'R', hidden:true}, {color:'G', hidden:true}, {color:'B', hidden:false}, {color:'P', hidden:false}],
                [{color:'P', hidden:true}, {color:'Y', hidden:true}, {color:'R', hidden:false}, {color:'G', hidden:false}],
                [{color:'Y', hidden:false}, {color:'P', hidden:false}, {color:'G', hidden:false}, {color:'B', hidden:false}],
                [{color:'B', hidden:false}, {color:'R', hidden:false}, {color:'Y', hidden:false}, {color:'P', hidden:false}],
                [{color:'G', hidden:false}, {color:'B', hidden:false}, {color:'R', hidden:false}, {color:'Y', hidden:false}],
                []
            ];
        } else {
            this.generateLevelData(this.level);
        }
    }

    generateLevelData(level) {
        const colorKeys = ['R', 'G', 'B', 'Y', 'P', 'C', 'O', 'Pi', 'L', 'Br', 'T', 'N'];
        let numColors = Math.min(12, 5 + Math.floor((level - 3) / 6));
        this.starGoal = numColors;

        let bottles = [];
        for (let i = 0; i < numColors; i++) {
            let bottle = [];
            for (let j = 0; j < 4; j++) {
                bottle.push({ color: colorKeys[i], hidden: false });
            }
            bottles.push(bottle);
        }
        bottles.push([]); // 1 empty bottle

        let shuffleSteps = 50 + level * 5;
        let lastMove = null;
        for (let step = 0; step < shuffleSteps; step++) {
            let validMoves = [];
            for (let i = 0; i < bottles.length; i++) {
                for (let j = 0; j < bottles.length; j++) {
                    if (i === j) continue;
                    let source = bottles[i];
                    let target = bottles[j];
                    if (source.length > 0 && target.length < 4) {
                        if (source.length === 1 || source[source.length - 1].color === source[source.length - 2].color) {
                            if (!(lastMove && i === lastMove.tgt && j === lastMove.src)) {
                                validMoves.push({ src: i, tgt: j });
                            }
                        }
                    }
                }
            }
            if (validMoves.length > 0) {
                let move = validMoves[Math.floor(Math.random() * validMoves.length)];
                let segment = bottles[move.src].pop();
                bottles[move.tgt].push(segment);
                lastMove = move;
            } else {
                lastMove = null; // fallback if stuck
            }
        }

        let hiddenProb = Math.min(0.6, (level - 3) * 0.02);
        for (let i = 0; i < bottles.length; i++) {
            for (let j = 0; j < bottles[i].length - 1; j++) {
                if (Math.random() < hiddenProb) {
                    bottles[i][j].hidden = true;
                }
            }
        }

        this.bottlesData = bottles;
    }

    drawBottles() {
        this.bottles = [];
        const numBottles = this.bottlesData.length;
        const bottleWidth = 60;
        const bottleHeight = 200;
        const spacing = 20;

        let cols = Math.min(7, numBottles); // Max 7 bottles per row
        let rows = Math.ceil(numBottles / cols);

        const startY = this.scale.height / 2 - (rows > 1 ? 80 : 0); // Offset Y if multi-row

        this.bottlesData.forEach((data, index) => {
            let r = Math.floor(index / cols);
            let c = index % cols;

            // Re-calculate startX per row to center it if last row has fewer items
            let itemsInRow = (r === rows - 1 && numBottles % cols !== 0) ? numBottles % cols : cols;
            let totalRowWidth = itemsInRow * bottleWidth + (itemsInRow - 1) * spacing;
            let startX = (this.scale.width - totalRowWidth) / 2 + bottleWidth / 2;

            const x = startX + c * (bottleWidth + spacing);
            const y = startY + r * (bottleHeight + 60); // 60 padding between rows

            let bottleContainer = this.add.container(x, y);
            bottleContainer.bottleIndex = index;
            bottleContainer.isCompleted = false;

            // Bottle outline
            let graphics = this.add.graphics();
            graphics.lineStyle(4, 0xffffff, 1);
            graphics.strokeRoundedRect(-bottleWidth/2, -bottleHeight, bottleWidth, bottleHeight, 10);
            bottleContainer.add(graphics);

            // Hit area
            bottleContainer.setSize(bottleWidth, bottleHeight);
            let hitZone = this.add.zone(0, -bottleHeight/2, bottleWidth, bottleHeight).setInteractive();
            hitZone.on('pointerdown', () => this.handleBottleClick(index));
            bottleContainer.add(hitZone);

            // Segments container
            let segmentsContainer = this.add.container(0, 0);
            bottleContainer.add(segmentsContainer);
            bottleContainer.segmentsContainer = segmentsContainer;

            this.bottles.push(bottleContainer);
        });

        this.updateVisuals();
    }

    updateVisuals() {
        const bottleWidth = 60;
        const segmentHeight = 200 / this.maxSegments;

        this.bottles.forEach((bottleContainer, index) => {
            let segmentsContainer = bottleContainer.segmentsContainer;
            segmentsContainer.removeAll(true);

            let data = this.bottlesData[index];

            // Check if bottle is newly completed
            if (!bottleContainer.isCompleted && data.length === this.maxSegments) {
                const firstColor = data[0].color;
                const allSame = data.every(seg => seg.color === firstColor && !seg.hidden);
                if (allSame) {
                    bottleContainer.isCompleted = true;
                    this.stars++;
                    this.starsText.setText(`星星: ${this.stars}/${this.starGoal}`);

                    // Star visual effect
                    let star = this.add.text(bottleContainer.x, bottleContainer.y - 230, '★', { fontSize: '40px', fill: '#ffff00', fontFamily: 'sans-serif' }).setOrigin(0.5);
                    this.tweens.add({
                        targets: star,
                        y: star.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => star.destroy()
                    });

                    if (this.stars >= this.starGoal) {
                        this.time.delayedCall(1000, () => this.levelComplete(), [], this);
                    }
                }
            }

            data.forEach((segment, segIndex) => {
                let color = segment.hidden ? this.colorMap['?'] : this.colorMap[segment.color];
                let rect = this.add.rectangle(0, -segIndex * segmentHeight - segmentHeight/2, bottleWidth - 8, segmentHeight - 2, color);
                segmentsContainer.add(rect);

                if (segment.hidden) {
                    let text = this.add.text(0, -segIndex * segmentHeight - segmentHeight/2, '?', { fontSize: '20px', fill: '#000', fontFamily: 'sans-serif' }).setOrigin(0.5);
                    segmentsContainer.add(text);
                }
            });
        });
    }

    handleBottleClick(index) {
        if (this.isPouring || this.stars >= this.starGoal) return;

        const bottle = this.bottles[index];
        if (bottle.isCompleted) return; // Cannot interact with completed bottles

        if (this.selectedBottle === null) {
            // Select source
            if (this.bottlesData[index].length > 0) {
                this.selectedBottle = index;
                this.tweens.add({ targets: bottle, y: bottle.y - 20, duration: 100 });
            }
        } else {
            // Deselect if same
            if (this.selectedBottle === index) {
                this.tweens.add({ targets: this.bottles[this.selectedBottle], y: this.bottles[this.selectedBottle].y + 20, duration: 100 });
                this.selectedBottle = null;
                return;
            }

            // Try to pour
            if (this.canPour(this.selectedBottle, index)) {
                this.pour(this.selectedBottle, index);
            } else {
                // Invalid move, shake and deselect
                let sourceBottle = this.bottles[this.selectedBottle];
                this.tweens.add({
                    targets: sourceBottle,
                    x: sourceBottle.x + 5,
                    yoyo: true,
                    repeat: 2,
                    duration: 50,
                    onComplete: () => {
                        this.tweens.add({ targets: sourceBottle, y: sourceBottle.y + 20, duration: 100 });
                    }
                });
                this.selectedBottle = null;
                this.isPouring = true; // Block rapid clicks during shake
                setTimeout(() => { this.isPouring = false; }, 150);
                this.invalidMoves++;
                if (this.invalidMoves >= 3) {
                    this.showHint();
                }
            }
        }
    }

    showHint() {
        for (let i = 0; i < this.bottlesData.length; i++) {
            for (let j = 0; j < this.bottlesData.length; j++) {
                if (i !== j && !this.bottles[i].isCompleted && this.canPour(i, j)) {
                    // Flash source and target bottles
                    this.tweens.add({
                        targets: [this.bottles[i], this.bottles[j]],
                        alpha: 0.5,
                        yoyo: true,
                        repeat: 3,
                        duration: 300
                    });

                    // Show text hint
                    let hintText = this.add.text(this.scale.width / 2, this.scale.height - 50, '提示：你可以把药水倒到闪烁的瓶子里！', { fontSize: '24px', fill: '#ff0', fontFamily: 'sans-serif' }).setOrigin(0.5);
                    this.tweens.add({
                        targets: hintText,
                        alpha: 0,
                        delay: 2000,
                        duration: 1000,
                        onComplete: () => hintText.destroy()
                    });

                    this.invalidMoves = 0; // Reset after showing hint
                    return;
                }
            }
        }

        // If no valid moves
        let noMoveText = this.add.text(this.scale.width / 2, this.scale.height - 50, '提示：没有可以移动的药水了，请重新开始！', { fontSize: '24px', fill: '#f00', fontFamily: 'sans-serif' }).setOrigin(0.5);
        this.tweens.add({
            targets: noMoveText,
            alpha: 0,
            delay: 2000,
            duration: 1000,
            onComplete: () => noMoveText.destroy()
        });
        this.invalidMoves = 0;
    }

    canPour(sourceIndex, targetIndex) {
        let sourceData = this.bottlesData[sourceIndex];
        let targetData = this.bottlesData[targetIndex];

        if (sourceData.length === 0) return false;
        if (targetData.length === this.maxSegments) return false;

        let sourceTopColor = sourceData[sourceData.length - 1].color;
        let sourceTopHidden = sourceData[sourceData.length - 1].hidden;

        if (sourceTopHidden) return false; // Cannot pour hidden layer

        if (targetData.length === 0) return true; // Can pour into empty

        let targetTopColor = targetData[targetData.length - 1].color;
        let targetTopHidden = targetData[targetData.length - 1].hidden;

        return !targetTopHidden && sourceTopColor === targetTopColor;
    }

    pour(sourceIndex, targetIndex) {
        this.isPouring = true;
        let sourceData = this.bottlesData[sourceIndex];
        let targetData = this.bottlesData[targetIndex];

        let sourceTopColor = sourceData[sourceData.length - 1].color;

        // Count how many segments of the same color are at the top
        let segmentsToMove = 0;
        for (let i = sourceData.length - 1; i >= 0; i--) {
            if (sourceData[i].color === sourceTopColor && !sourceData[i].hidden) {
                segmentsToMove++;
            } else {
                break;
            }
        }

        // Limit by available space in target
        let availableSpace = this.maxSegments - targetData.length;
        segmentsToMove = Math.min(segmentsToMove, availableSpace);

        // Simple animation logic: delay visual update
        let sourceBottle = this.bottles[sourceIndex];
        let targetBottle = this.bottles[targetIndex];

        // Move source bottle above target bottle
        let originalSourceX = sourceBottle.x;
        let originalSourceY = sourceBottle.y + 20; // Re-adjust because it was raised

        this.tweens.add({
            targets: sourceBottle,
            x: targetBottle.x,
            y: targetBottle.y - 250,
            angle: 45,
            duration: 300,
            onComplete: () => {
                // Perform data transfer
                let transferred = sourceData.splice(sourceData.length - segmentsToMove, segmentsToMove);
                targetData.push(...transferred);

                // Reveal hidden layer in source if applicable
                if (sourceData.length > 0 && sourceData[sourceData.length - 1].hidden) {
                    sourceData[sourceData.length - 1].hidden = false;
                }

                this.updateVisuals();

                // Move back
                this.tweens.add({
                    targets: sourceBottle,
                    x: originalSourceX,
                    y: originalSourceY,
                    angle: 0,
                    duration: 300,
                    onComplete: () => {
                        this.selectedBottle = null;
                        this.isPouring = false;
                        this.invalidMoves = 0;
                    }
                });
            }
        });
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`时间: ${this.formatTime(this.timeLeft)}`);
        if (this.timeLeft <= 0) {
            this.timeEvent.remove();
            this.scene.start('GameOver', { level: this.level });
        }
    }

    formatTime(seconds) {
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    levelComplete() {
        this.timeEvent.remove();
        if (this.level >= 50) {
            this.scene.start('FinalClear');
        } else {
            this.scene.start('LevelClear', { level: this.level });
        }
    }
}
