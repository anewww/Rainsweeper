import { game } from './main.js'

export default class Button {
    constructor() {
        this.image = null;
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

    init(foo) {
        this.image.on('mousedown touchstart', foo); //.bind(this));
    }
}