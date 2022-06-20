import Cell from './Cell.js'
import { game } from './main.js'

export default class Field {
    constructor(w, h, m, dif) {
        this.cells = [];
        this.memory = [];
        this.opened = [];
        if (!dif)
            this.difficulty = 'easy';
        else
            this.difficulty = dif;
        this.width = w;
        this.height = h;
        this.mines = m;
        this.image = null;
        this.isFirstMove = true;
    }

    create() {
        this.draw.call(this);
        //creating and initializing a 2d array with cells
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i * 50 * game.scale + ((window.innerWidth - 50 * game.scale * this.width) / 2), j * 50 * game.scale + 75, i, j);
            }
        }
        for (let row of this.cells) {
            for (let cell of row) {
                cell.drawClosed();
                // cell.addListener(cell.image);
                // cell.addRCListener(cell.image);
            }
        }
        // this.draw.call(this);
        this.generateMines();
    }

    draw() {
        let fieldImgObj = new Image();
        let path = null;
        let imgw = null;
        let imgh = null;
        switch (this.difficulty) {
            case 'easy':
                path = './src/img/field-12x15.png';
                imgw = 700;
                imgh = 850;
                break;
            case 'medium':
                path = './src/img/field-15x18.png';
                imgw = 850;
                imgh = 1000;
                break;
            case 'hard':
                path = './src/img/field-20x20.png';
                imgw = 1100;
                imgh = 1100;
                break;
        }
        fieldImgObj.src = path;
        this.image = new Konva.Image({
            // x: this.cells[0][0].x - 50 * game.scale,
            x: ((window.innerWidth - 50 * game.scale * this.width) / 2) - 50 * game.scale,
            // y: this.cells[0][0].y - 50 * game.scale,
            y: 75 - 50 * game.scale,
            image: fieldImgObj,
            width: imgw,
            height: imgh,
            scaleX: game.scale,
            scaleY: game.scale,
        });
        // game.stage.add(game.layerField);
        game.layerField.add(this.image);
        game.layerField.zIndex(0);
        // for (let row of this.cells) {
        //     for (let cell of row) {
        //         cell.drawClosed();
        //         // cell.addListener(cell.image);
        //         // cell.addRCListener(cell.image);
        //     }
        // }
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
        for (let row of game.field.cells) {
            for (let cell of row) {
                    if (!cell.isOpened) {   
                    if (cell.status !== 'mine') {
                        cell.open();
                    }
                    else {
                        cell.flag();
                    }             
                }
            }
        }
    }

    regenerate() {
        game.field.memory = [];
        for (let row of game.field.cells) {
            for (let cell of row) {
                cell.drawClosed();
                cell.isOpened = false;
                cell.isFlagged = false;
            }
        }
    }

    undo() {
        // add listeners when undo clicking a mine
        for (let row of game.field.cells) {
            for (let cell of row) {
                if (!cell.isOpened && !cell.image.listening()) {
                    cell.image.listening(true);
                    cell.addRCListener(cell.image);
                }
            }
        }
        // undo last step
        for (let step of game.field.memory) {
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
        game.field.memory = [];
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

    generateSolvableField(i, j) {
        game.field.solvingAlgorithm();
        while (!game.field.isWon()) {
            console.log('newgame')
            game.newGame(this.width, this.height, this.mines, this.difficulty);
            game.field.cells[i][j].depthFirstSearch(i, j);
            game.field.solvingAlgorithm();
        }
        game.field.regenerate();
        game.field.cells[i][j].depthFirstSearch(i, j);
    }

    solvingAlgorithm() {
        let moveIsExist = false;
        do {
            moveIsExist = false;
            for (let cell of game.field.opened) {
                if (cell.status === 'num') {
                    let unrevealedCells = 0;
                    for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                        const nextI = cell.ind + di;
                        const nextJ = cell.jnd + dj;
                        if (this.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isOpened === false) {
                            unrevealedCells++;
                        }
                    }
                    if (unrevealedCells === cell.NearMines) {
                        moveIsExist = true;
                        game.field.opened = game.field.opened.filter(function(f) { return f !== cell });
                        for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                            const nextI = cell.ind + di;
                            const nextJ = cell.jnd + dj;
                            if (this.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isOpened === false) {
                                game.field.cells[nextI][nextJ].flag();
                            }
                        }
                    }
                }
                if (moveIsExist) break;
                if (cell.status === 'num') {
                    let markedCells = 0;
                    for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                        const nextI = cell.ind + di;
                        const nextJ = cell.jnd + dj;
                        if (this.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isOpened === false && game.field.cells[nextI][nextJ].isFlagged === true) {
                            markedCells++;
                        }
                    }
                    if (markedCells === cell.NearMines) {
                        moveIsExist = true;
                        game.field.opened = game.field.opened.filter(function(f) { return f !== cell });
                        for (let [di, dj] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
                            const nextI = cell.ind + di;
                            const nextJ = cell.jnd + dj;
                            if (this.withinField(nextI, nextJ) && game.field.cells[nextI][nextJ].isOpened === false && game.field.cells[nextI][nextJ].isFlagged === false) {
                                cell.depthFirstSearch(nextI, nextJ);
                            }
                        }
                    }
                }
                if (moveIsExist) break;
            }
        } while (moveIsExist);        
    }
}