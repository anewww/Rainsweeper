import { game } from './main.js'

export default class Button {
    constructor() {
        this.image = null;
    }

    draw(sequence, path) {
        let buttonObj = new Image();
        buttonObj.src = path;
        this.image = new Konva.Image({
            x: (window.innerWidth / 1920) * (1406 - 1237) * sequence,
            y: (window.innerWidth / 1920) * 21.5,
            image: buttonObj,
            width: (window.innerWidth / 1920) * 124,
            height: (window.innerWidth / 1920) * 57,
            // scaleX: this.scale,
            // scaleY: this.scale,
        });
        game.layerMenu.add(this.image);
    }

}