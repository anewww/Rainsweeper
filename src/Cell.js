import { game } from './main.js'

export default class Cell {
    constructor(x, y, i, j) {
        this.status = null;
        this.nearMines = 0;
        this.isOpened = false;
        this.isFlagged = false;
        this.isFlagSwitched = false;
        this.x = x;
        this.y = y;
        this.ind = i;
        this.jnd = j;
        this.image = null;
        this.text = null;
        this.timerID = null;
    }

    get NearMines() {
        return this.nearMines;
    }
    set NearMines(value) {
        if (this.status !== 'mine') {
            this.nearMines = value;
        }
    }

    depthFirstSearch(i, j) {
        game.field.cells[i][j].open();
        if (game.field.cells[i][j].status !== 'mine') {
            for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                const nextI = i + di;
                const nextJ = j + dj;
                if (game.field.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isOpened === false && game.field.cells[nextI][nextJ].isFlagged === false) {
                    if (game.field.cells[nextI][nextJ].status === 'mt') {
                        this.depthFirstSearch(nextI, nextJ);
                    }
                    else if (game.field.cells[nextI][nextJ].status === 'num' && game.field.cells[i][j].status !== 'num') {
                        game.field.cells[nextI][nextJ].open();
                    }
                }
            }
        }
        //solvingAlgorithm();
    }

    open() {
        if (!this.isFlagged) {
            this.isOpened = true;
            game.field.memory.push(this);
            // game.opened.push(this);
            switch (this.status) {
                case 'mine': 
                    this.drawMine();
                    for (let row of game.field.cells) {
                        for (let cell of row) {
                            if (!cell.isOpened) {
                                cell.image.listening(false);
                                cell.image.removeEventListener('contextmenu');
                            }
                        }
                    }
                    break;
                case 'mt':
                    this.drawEmpty();
                    break;
                case 'num':
                    this.drawNumber();
                    break;
                default:
                    console.log('Status is null (probably)');
            }
        }
    }

    flag() {
        game.field.memory.push(this);
        this.isFlagged = true;
        let flagImgObj = new Image();
        flagImgObj.src = './src/img/flag.png'
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            image: flagImgObj,
            width: 50,
            height: 50,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.layer.add(this.image);
        this.addClickListener(this.image);
        this.addRCListener(this.image);
    }

    drawClosed() {
        this.isOpened = false;
        this.isFlagged = false;
        let cellClosedImgObj = new Image();
        cellClosedImgObj.src = './src/img/cell.png'
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            image: cellClosedImgObj,
            width: 50,
            height: 50,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.layer.add(this.image);
        this.addClickListener(this.image);
        this.addRCListener(this.image);
    }

    drawEmpty() {
        let cellOpenedImgObj = new Image();
        cellOpenedImgObj.src = './src/img/cell-opened.png'
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            image: cellOpenedImgObj,
            width: 50,
            height: 50,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.layer.add(this.image);
    }

    drawMine() {
        let MineImgObj = new Image();
        MineImgObj.src = './src/img/mine.png'
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            image: MineImgObj,
            width: 50,
            height: 50,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.layer.add(this.image);
    }

    drawNumber() {
        this.drawEmpty();
        function drawDigit(color, number) {
            let simpleText = new Konva.Text({
                x: this.x + 25 * game.scale,
                y: this.y + 30 * game.scale,
                text: number,
                fontSize: 35 * game.scale,
                fontFamily: 'cursive',
                fill: color,
                align: 'center',
            });
            simpleText.offsetX(simpleText.width() / 2);
            simpleText.offsetY(simpleText.height() / 2);
            game.layer.add(simpleText);
            return simpleText;
        }
        switch (this.NearMines) {
            case 1: 
                this.text = drawDigit.call(this, '#6e4fd8', '1');
                break;
            case 2:
                this.text = drawDigit.call(this, '#709C6A', '2');
                break;
            case 3:
                this.text = drawDigit.call(this, '#AD3834', '3');
                break;
            case 4:
                this.text = drawDigit.call(this, '#4F5BFF', '4');
                break;
            case 5:
                this.text = drawDigit.call(this, '#991E1A', '5');
                break;
            case 6:
                this.text = drawDigit.call(this, '#27B8AE', '6');
                break;
            case 7:
                this.text = drawDigit.call(this, '0A0D0B', '7');
                break;
            case 8:
                this.text = drawDigit.call(this, '#8A8A8A', '8');
                break;
            default:
                console.log('This number does not exist');
        }
        this.addNumberListener(this.image, this.text);
    }

    addClickListener(img) {
        // click listener
        img.on('mousedown touchstart', ((e) => {
            switch (e.evt.type) {
                case 'mousedown':
                    if (e.evt.button === 0) {// && this.isFlagged === false) {
                        this.isFlagSwitched = false;
                        game.field.memory = [];
                        this.depthFirstSearch(this.ind, this.jnd);
                        if (game.field.isWon())
                            alert('you won');
                    }
                    break;
                case 'touchstart':
                    setTimeout(() => {
                        console.log(game.pinchZoom.isDragging)
                        if (game.pinchZoom.isDragging === false) {
                            this.isFlagSwitched = false;
                            this.timerID = setTimeout(() => {
                                window.navigator.vibrate(200);
                                this.rightClickHandler();
                                if (game.field.isWon())
                                    alert('you won');
                            }, 400);
                        }
                    }, 5);
                    break;
            }
            }).bind(this));

        img.on('touchend', (() => {
            console.log(game.pinchZoom.isDragging)
            setTimeout(() => {
                if (this.timerID)
                    clearTimeout(this.timerID);
                if (!game.pinchZoom.isDragging) {  
                    if (!this.isFlagSwitched) {
                        game.field.memory = [];
                        this.depthFirstSearch(this.ind, this.jnd);
                        if (game.field.isWon())
                            alert('you won');
                    }
                }
            }, 5);
        }).bind(this)); 
    }

    addRCListener(img) {
        img.addEventListener('contextmenu', this.rightClickHandler.bind(this));
    }

    rightClickHandler() {
        this.isFlagSwitched = true;
        if (!this.isFlagged) {
            game.field.memory = [];
            this.flag();
        }
        else {
            this.drawClosed();
        }
        if (game.field.isWon())
            alert('you won');
    }

    addNumberListener(img, num) {
        img.on('mousedown', handler.bind(this));
        num.on('mousedown', handler.bind(this));
        function handler() {
            if (this.status === 'num' && this.isOpened) {
                let flagged = 0;
                for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                    const nextI = this.ind + di;
                    const nextJ = this.jnd + dj;
                    if (game.field.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isFlagged) {
                        flagged++;
                    }
                }
                if (flagged === this.nearMines) {
                    for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                        const nextI = this.ind + di;
                        const nextJ = this.jnd + dj;
                        if (game.field.withinField(nextI, nextJ) && !game.field.cells[nextI][nextJ].isOpened && !game.field.cells[nextI][nextJ].isFlagged) {
                            game.field.memory = [];
                            game.field.cells[nextI][nextJ].depthFirstSearch(nextI, nextJ);
                        }
                    }
                }
            } 
        }
    }
}