import { game } from './main.js'

export default class Cell {
    constructor(x, y, i, j) {
        this.status = null;
        this.nearMines = 0;
        this.isOpened = false;
        this.isFlagged = false;
        this.x = x;
        this.y = y;
        this.ind = i;
        this.jnd = j;
        this.image = null;
    }

    get NearMines() {
        return this.nearMines;
    }
    set NearMines(value) {
        if (this.status !== 'mine') {
            this.nearMines = value;
        }
    }

    open() {
        this.isOpened = true;
        game.field.memory.push([this, 1]);
        // game.opened.push(this);
        switch (this.status) {
            case 'mine': 
                this.drawMine();
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

    flag() {
        this.isFlagged = true;
        let flagImgObj = new Image();
        flagImgObj.src = './src/img/flag.png'
        this.image = new Konva.Image({
            x: this.x,
            y: this.y,
            image: flagImgObj,
            width: 50,
            height: 50,
        });
        game.layer.add(this.image);
        this.addListener(this.image);
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
        });
        game.layer.add(this.image);
        this.addListener(this.image);
    }

    drawOpened() {

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
        });
        game.layer.add(this.image);
    }

    drawNumber() {
        this.drawEmpty();
        function drawDigit(color, number) {
            let simpleText = new Konva.Text({
                x: this.x + 25,
                y: this.y + 25 + 5,
                text: number,
                fontSize: 35,
                //fontFamily: 'arial sans-serif',
                fontFamily: 'cursive',
                fill: color,
                align: 'center',
                //fontStyle: 'bold',
            });
            simpleText.offsetX(simpleText.width() / 2);
            simpleText.offsetY(simpleText.height() / 2);
            game.layer.add(simpleText);
        }
        switch (this.NearMines) {
            case 1: 
                drawDigit.call(this, '#6e4fd8', '1');
                break;
            case 2:
                drawDigit.call(this, '#709C6A', '2');
                break;
            case 3:
                drawDigit.call(this, '#AD3834', '3');
                break;
            case 4:
                drawDigit.call(this, '#4F5BFF', '4');
                break;
            case 5:
                drawDigit.call(this, '#991E1A', '5');
                break;
            case 6:
                drawDigit.call(this, '#27B8AE', '6');
                break;
            case 7:
                drawDigit.call(this, '#080a09', '7');
                break;
            case 8:
                drawDigit.call(this, '#7b7b7b', '8');
                break;
            default:
                console.log('This number does not exist');
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

    addListener(img) {
        // click listener
        //let thisCell = this;        
        img.on('mousedown touchend', (e) => {
            switch (e.evt.type) {
                case 'mousedown':
                    if (e.evt.button === 0 && this.isFlagged === false) {
                        game.field.memory = [];
                        this.depthFirstSearch(this.ind, this.jnd);
                    }
                    break;
                case 'touchend':
                    game.field.memory = [];
                    this.depthFirstSearch(this.ind, this.jnd);
                    break;
            }
            
        });
        
        // right click listener
        img.addEventListener('contextmenu', () => {
            //e.preventDefault();
            if (this.isFlagged === false) {
                this.isFlagged = true;
                this.flag();
            }
            else {
                this.isFlagged = false;
                this.drawClosed();
            }
        });
    }
}
