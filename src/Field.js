import Cell from './Cell.js'
import { game } from './main.js'

export default class Field {
    constructor(w, h, m) {
        this.cells = [];
        this.memory = [];
        this.width = w;
        this.height = h;
        this.mines = m;
        this.image = null;
    }

    create() {
        //creating and initializing a 2d array with cells
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i * 50 * game.scale + ((window.innerWidth - 50 * game.scale * this.width) / 2), j * 50 * game.scale + 75, i, j);
            }
        }
        this.draw.call(this);
        this.generateMines();
    }

    draw() {
        let fieldImgObj = new Image();
        fieldImgObj.src = './src/img/field-12x15.png'
        this.image = new Konva.Image({
            x: this.cells[0][0].x - 50 * game.scale,
            y: this.cells[0][0].y - 50 * game.scale,
            image: fieldImgObj,
            width: 700,
            height: 850,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.stage.add(game.layerField);
        game.layerField.add(this.image);
        game.layerField.zIndex(0);
        for (let row of this.cells) {
            for (let cell of row) {
                cell.drawClosed();
                // cell.addListener(cell.image);
                // cell.addRCListener(cell.image);
            }
        }
    }

    generateMines() {
        let cur = 0;
        let i, j;
        while (cur !== this.mines) {
            i = Math.floor(Math.random() * (this.width - 1));
            j = Math.floor(Math.random() * (this.height - 1));
            if (this.cells[i][j].status !== 'mine') {
                this.cells[i][j].status = game.cellStatus.mine;
                cur++;
            }
        }
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.cells[i][j].status === 'mine') {
                    for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                        const nextI = i + di;
                        const nextJ = j + dj;
                        if (this.withinField(nextI, nextJ) && this.cells[nextI][nextJ].status !== 'mine') {
                            this.cells[nextI][nextJ].NearMines++;
                        }
                    }
                }
            }
        }
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.NearMines > 0) cell.status = game.cellStatus.number;
                else if (cell.status !== 'mine') cell.status = game.cellStatus.empty;
            }
        }
    }

    withinField(i, j) {
        return 0 <= i && i < this.width && 0 <= j && j < this.height;
    }

    reveal() {
        // console.log(this.cells)
        for (let row of this.cells) {
            for (let cell of row) {
                    // console.log(cell.status)
                    if (!cell.isOpened) {   
                    // console.log(cell.status)
                    //this.memory.push(cell); //// /1 /2!?!!?!? ?? ?!?!
                    if (cell.status !== 'mine') {
                        cell.open();
                    }
                    else {
                        cell.flag();
                        //this.memory.push(cell); // !? !?!? 3/?#!@@ ?? ??
                    }             
                }
            }
        }
    }

    regenerate() {
        this.memory = [];
        for (let row of this.cells) {
            for (let cell of row) {
                cell.drawClosed();
                cell.isOpened = false;
                cell.isFlagged = false;
            }
        }
    }

    undo() {
        // add listeners when undo clicking a mine
        for (let row of this.cells) {
            for (let cell of row) {
                if (!cell.isOpened && !cell.image.listening()) {
                    cell.image.listening(true);
                    cell.addRCListener(cell.image);
                }
            }
        }
        // undo last step
        for (let step of this.memory) {
            if (step.isFlagSwitched) {
                if (!step.isFlagged)
                    step.flag();
                else {
                    step.drawClosed();
                    //step.addRCListener(step.image);
                }
            }
            else {
                step.drawClosed();
            }
        }
        this.memory = [];
    }

    isWon() {
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.status === 'mine' && cell.isOpened) {
                    return false;
                }
                else if (!cell.isOpened) {
                    if (!cell.isFlagged) {
                        return false;
                    }
                    else if (cell.status !== 'mine') {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}