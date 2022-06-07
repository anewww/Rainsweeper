import Cell from './Cell.js'
import { game } from './main.js'

export default class Field {
    constructor(w, h, m) {
        this.cells = [];
        this.memory = [];
        this.width = w;
        this.height = h;
        this.mines = m;
        this.fieldImg = null;
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
        this.fieldImg = new Konva.Image({
            x: this.cells[0][0].x - 50 * game.scale,
            y: this.cells[0][0].y - 50 * game.scale,
            image: fieldImgObj,
            width: 700,
            height: 850,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        game.stage.add(game.layerField);
        game.layerField.add(this.fieldImg);
        game.layerField.zIndex(0);
        for (let row of this.cells) {
            for (let cell of row) {
                cell.drawClosed();
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
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.isOpened === false) {
                    this.memory.push([cell, 1]);
                    if (cell.status !== 'mine') {
                        cell.open();
                    }
                    else {
                        cell.flag();
                        this.memory.push([cell, 2]);
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
        for (let step of this.memory) {
            if (step[1] === 1)
                step[0].drawClosed();
            else if (step[1] === 2) {
                if (step[0].isFlagged === false)
                    step[0].flag();
                else
                    step[0].drawClosed();
            }
        }
        this.memory = [];
    }
}
