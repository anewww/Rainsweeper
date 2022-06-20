import { game } from './main.js'
export { DifficultiesSwitcher, Easy, Meduim, Hard, NPSwitcher, MuteSwitcher }

export default class Button {
    constructor(sequence, stSw, foo) {
        this.sequence = sequence;
        this.image = null;
        this.foo = foo;
        this.stateSwitcher = stSw;
    }

    draw(sequence, path) {
        let scaleCoef = window.innerWidth / 1920;
        let buttonObj = new Image();
        buttonObj.src = path;
        if (this.stateSwitcher) {
            this.stateSwitcher.currentState.draw(this);
            this.stateSwitcher.currentState.change(this.stateSwitcher);
        }
        else {
            if (!game.isMobile) {
                this.image = new Konva.Image({
                    x: 392 * scaleCoef + sequence * 169 * scaleCoef,
                    y: scaleCoef * 21.5,
                    image: buttonObj,
                    width: scaleCoef * 124,
                    height: scaleCoef * 57,
                });
            }
            else {
                if (sequence < 4) {
                    this.image = new Konva.Image({
                        x: 127.5 * scaleCoef + sequence * (567.5 - 127.5) * scaleCoef,
                        y: scaleCoef * 373,
                        image: buttonObj,
                        width: scaleCoef * 337,
                        height: scaleCoef * 152.5,
                    });
                }
                else {
                    let seq = sequence - 4;
                    this.image = new Konva.Image({
                        x: 267.5 * scaleCoef + seq * (795 - 267.5) * scaleCoef,
                        y: scaleCoef * 72.5,
                        image: buttonObj,
                        width: scaleCoef * 337,
                        height: scaleCoef * 152.5,
                    });
                }
            }
            game.layerMenu.add(this.image);
        }
    }

    init() {
        let bg = null;
        this.image.on('mousedown touchstart', () => {
            this.foo();
            bg = new Konva.Rect({
                x: this.image.x(),
                y: this.image.y(),
                width: this.image.width(),
                height: this.image.height(),
                fill: '#1c1f32',
            });
            game.layerMenu.add(bg);
            bg.on('mouseup touchend', () => {
                bg.destroy();
                if (this.stateSwitcher) {
                    this.stateSwitcher.go(this);
                }
            });
        });
    }
}

// difficulties
class DifficultiesSwitcher {
    constructor(oldState) {
        if (oldState)
            this.currentState = oldState;
        else
            this.currentState = new Easy();
    }
    
    go(button) {
        this.currentState.init(this, button);
    }

    draw(button) {
        this.currentState.draw(button);
    }

    // change(newState) {
    //     this.currentState = newState;
    // }
}

class Easy {
    constructor() {
        this.name = 'easy';
        this.width = 12;
        this.height = 15;
        this.mines = 30;
    }

    draw(button) {
        drawDif(button, './src/img/dif-easy.png')
        button.init();
    }

    init(stateSw, button) {
        this.draw(button);
        game.newGame(this.width, this.height, this.mines, 'easy');
        this.change(stateSw);
        // stateSw.change(new Meduim());
    }

    change(stateSw) {
        stateSw.currentState = new Meduim();
    }
}

class Meduim {
    constructor() {
        this.name = 'medium';
        this.width = 15;
        this.height = 18;
        this.mines = 50;
    }

    draw(button) {
        drawDif(button, './src/img/dif-medium.png')
        button.init();
    }

    init(stateSw, button) {
        this.draw(button);
        game.newGame(this.width, this.height, this.mines, 'medium');
        this.change(stateSw);
        // stateSw.change(new Meduim());
    }

    change(stateSw) {
        stateSw.currentState = new Hard();
    }
}

class Hard {
    constructor() {
        this.name = 'hard';
        this.width = 20;
        this.height = 20;
        this.mines = 70;
    }

    draw(button) {
        drawDif(button, './src/img/dif-hard.png')
        button.init();
    }

    init(stateSw, button) {
        this.draw(button);
        game.newGame(this.width, this.height, this.mines, 'hard');
        this.change(stateSw);
        // stateSw.change(new Meduim());
    }

    change(stateSw) {
        stateSw.currentState = new Easy();
    }
}

function drawDif(button, path) {
    let scaleCoef = window.innerWidth / 1920;
        let buttonObj = new Image();
        buttonObj.src = path;
    if (!game.isMobile) {
        button.image = new Konva.Image({
        x: 392 * scaleCoef + button.sequence * 169 * scaleCoef,
        y: scaleCoef * 21.5,
        image: buttonObj,
        width: scaleCoef * 124,
        height: scaleCoef * 57,
        });
    }
    else {
        button.image = new Konva.Image({
            x: 127.5 * scaleCoef + button.sequence * 552.5 * scaleCoef,
            y: scaleCoef * 373,
            image: buttonObj,
            width: scaleCoef * 337,
            height: scaleCoef * 152.5,
        });
    }

    game.layerMenu.add(button.image);
}

// NP and mute
class NPSwitcher {
    constructor() {
        this.currentState = new NPSecondState();
    }
    
    go(button) {
        this.currentState.init(this, button);
    }

    draw(button) {
        this.currentState.draw(button);
    }

    // change(newState) {
    //     this.currentState = newState;
    // }
}

class NPFirstState {
    constructor() {

    }

    draw(button) {
        drawlastButtons(button, './src/img/np.png');
        button.init();
    }

    init(stateSw, button) {
        this.draw(button);
        game.isSolvable = true;
        // stateSw.change(new NPSecondState());
        this.change(stateSw);
    }

    change(stateSw) {
        stateSw.currentState = new NPSecondState();
    }
}

class NPSecondState {
    constructor() {

    }

    draw(button) {
        drawlastButtons(button, './src/img/no-np.png');
        button.init();   
    }

    init(stateSw, button) {
        this.draw(button);
        game.isSolvable = false;
        // stateSw.change(new NPFirstState());
        this.change(stateSw);
    }

    change(stateSw) {
        stateSw.currentState = new NPFirstState();
    }
}

class MuteSwitcher {
    constructor() {
        this.currentState = new MuteSecondState();
    }
    
    go(button) {
        this.currentState.init(this, button);
    }

    draw(button) {
        this.currentState.draw(button);
    }

    // change(newState) {
    //     this.currentState = newState;
    // }
}

class MuteFirstState {
    constructor() {

    }

    draw(button) {
        drawlastButtons(button, './src/img/mute.png');
        button.init();
    }

    init(stateSw, button) {
        this.draw(button);
        game.audio.muted = false;
        // stateSw.change(new MuteSecondState());
        this.change(stateSw);
    }

    change(stateSw) {
        stateSw.currentState = new MuteSecondState();
    }
}

class MuteSecondState {
    constructor() {

    }

    draw(button) {
        drawlastButtons(button, './src/img/unmute.png');
        button.init();    
    }

    init(stateSw, button) {
        this.draw(button);
        game.audio.muted = true;
        // stateSw.change(new MuteFirstState());
        this.change(stateSw);
    }

    change(stateSw) {
        stateSw.currentState = new MuteFirstState();
    }
}

function drawlastButtons(button, path) {
    let scaleCoef = window.innerWidth / 1920;
    let buttonObj = new Image();
    buttonObj.src = path;
    if (!game.isMobile) {
        button.image = new Konva.Image({
            x: 392 * scaleCoef + button.sequence * 169 * scaleCoef,
            y: scaleCoef * 21.5,
            image: buttonObj,
            width: scaleCoef * 124,
            height: scaleCoef * 57,
        });
    }
    else {
        let sequence = button.sequence - 4;
        button.image = new Konva.Image({
            x: 267.5 * scaleCoef + sequence * (795 - 267.5) * scaleCoef,
            y: scaleCoef * 72.5,
            image: buttonObj,
            width: scaleCoef * 337,
            height: scaleCoef * 152.5,
        });
    }
    game.layerMenu.add(button.image);
}