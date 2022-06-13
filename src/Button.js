import { game } from './main.js'
export { DifficultiesStates }

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
        this.image = new Konva.Image({
            x: 392 * scaleCoef + sequence * 169 * scaleCoef,
            y: scaleCoef * 21.5,
            image: buttonObj,
            width: scaleCoef * 124,
            height: scaleCoef * 57,
        });
        game.layerMenu.add(this.image);
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
class DifficultiesStates {
    constructor() {
        this.currentState = new Meduim();
    }
    
    go(button) {
        this.currentState.draw(this, button);
    }

    change(newState) {
        this.currentState = newState;
    }
}

class Easy {
    constructor() {

    }

    draw(stateSw, button) {
        let scaleCoef = window.innerWidth / 1920;
        let buttonObj = new Image();
        buttonObj.src = './src/img/dif-easy.png';
        button.image = new Konva.Image({
            x: 392 * scaleCoef + button.sequence * 169 * scaleCoef,
            y: scaleCoef * 21.5,
            image: buttonObj,
            width: scaleCoef * 124,
            height: scaleCoef * 57,
        });
        game.layerMenu.add(button.image);
        button.init();

        stateSw.change(new Meduim());
    }
}

class Meduim {
    constructor() {

    }

    draw(stateSw, button) {
        let scaleCoef = window.innerWidth / 1920;
        let buttonObj = new Image();
        buttonObj.src = './src/img/dif-medium.png';
        button.image = new Konva.Image({
            x: 392 * scaleCoef + button.sequence * 169 * scaleCoef,
            y: scaleCoef * 21.5,
            image: buttonObj,
            width: scaleCoef * 124,
            height: scaleCoef * 57,
        });
        game.layerMenu.add(button.image);
        button.init();

        stateSw.change(new Hard());
    }
}

class Hard {
    constructor() {

    }

    draw(stateSw, button) {
        let scaleCoef = window.innerWidth / 1920;
        let buttonObj = new Image();
        buttonObj.src = './src/img/dif-hard.png';
        button.image = new Konva.Image({
            x: 392 * scaleCoef + button.sequence * 169 * scaleCoef,
            y: scaleCoef * 21.5,
            image: buttonObj,
            width: scaleCoef * 124,
            height: scaleCoef * 57,
        });
        game.layerMenu.add(button.image);
        button.init();

        stateSw.change(new Easy());
    }
}

// NP and mute
class Switcher {
    constructor() {
        this.currentState = new FirstState();
    }
    
    go() {
        currentState.draw();
    }

    change(newState) {
        this.currentState = newState;
    }
}

class FirstState {
    constructor() {

    }

    draw() {
        // paste the image

        states.change(new SecondState());
    }
}

class SecondState {
    constructor() {

    }

    draw() {
        // paste the image

        states.change(new FirstState());
    }
}