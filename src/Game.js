import Field from './Field.js'
import Button from './Button.js'

export default class Game {
    constructor() {
        if (!Game._instance) {
            Game._instance = this;
        }
        else {
            return Game._instance;
        }
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
        });
        this.stageMenu = new Konva.Stage({
            container: 'menu',
            width: window.innerWidth,
            height: (window.innerWidth / 1920) * 100,
        });
        this.layer = new Konva.Layer();
        this.layerField = new Konva.Layer();
        this.layerMenu = new Konva.Layer();
        this.cellStatus = {
            mine: 'mine',
            empty: 'mt',
            number: 'num',
        }
        this.field = null;
        this.pinchZoom = {
            lastCenter: null,
            lastDist: 0,
            isDragging: false,
        }
        this.scale = 1;
    }

    static getInstance() {
        return this._instance;
    }

    init() {
        // konva init stages and layers
        this.stage.add(this.layer);
        this.stageMenu.add(this.layerMenu);
        // adaptation bg
        let body = document.getElementsByTagName('body');
        body[0].style.backgroundSize = window.innerWidth + 'px ' + window.innerHeight + 'px';
        // adaptation menu bar
        let menu = document.getElementById('menu');
        let menuOffsetY = window.innerHeight - this.stageMenu.height();
        menu.style.top = menuOffsetY + 'px';
        // adding the menu
        let menuImgObj = new Image();
        menuImgObj.src = './src/img/menu.png'
        let menuImg = new Konva.Image({
            x: 0,
            y: 0,
            image: menuImgObj,
            width: this.stageMenu.width(),
            height: this.stageMenu.height(),
        });
        this.layerMenu.add(menuImg);

        // get JSON
        let requestURL = 'https://anewww.github.io/Rainsweeper/src/buttons-paths.json';
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        // creating and drawing the buttons
        let buttons = [];
        request.onload = function() {
            let json = request.response;
            for (let i = 0; i < 7; i++) {
                buttons[i] = new Button();
                buttons[i].draw(i, json.paths[i]);
            }
        }
        buttons[0].init(this.difficulties);
        buttons[1].init(this.newGame.bind(this, field.width, field.height, field.mines));
        buttons[2].init(this.field.regenerate);
        buttons[3].init(this.field.reveal);
        buttons[4].init(this.nonPolynomial);
        buttons[5].init(this.mute);
        buttons[6].init(this.field.undo);

        // prevent contextmenu while rightclicking
        this.stage.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        // undo listener
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'z' || e.key === 'я') && e.ctrlKey === true) {
                this.field.undo();
            }
        });

        // mobile scaling
        this.stage.on('touchmove touchstart', (function(e) {
            e.evt.preventDefault();
            let touch1 = e.evt.touches[0];
            let touch2 = e.evt.touches[1];

            if (touch1 && touch2) {
                this.pinchZoom.isDragging = true;

                let p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                let p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };
                if (!this.pinchZoom.lastCenter) {
                    this.pinchZoom.lastCenter = getCenter(p1, p2);
                    return;
                }
                let newCenter = getCenter(p1, p2);
                let dist = getDistance(p1, p2);
                if (!this.pinchZoom.lastDist) {
                    this.pinchZoom.lastDist = dist;
                }
                // local coordinates of center point
                let pointTo = {
                    x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
                    y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
                };

                let stageScale = this.stage.scaleX() * (dist / this.pinchZoom.lastDist);
                this.stage.scaleX(stageScale);
                this.stage.scaleY(stageScale);

                // calculate new position of the stage
                let dx = newCenter.x - this.pinchZoom.lastCenter.x;
                let dy = newCenter.y - this.pinchZoom.lastCenter.y;

                let newPos = {
                    x: newCenter.x - pointTo.x * stageScale + dx,
                    y: newCenter.y - pointTo.y * stageScale + dy,
                };
                this.stage.position(newPos);

                this.pinchZoom.lastDist = dist;
                this.pinchZoom.lastCenter = newCenter;
            }
        }).bind(this));

        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

        function getCenter(p1, p2) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };
        }

        this.stage.on('touchend', (function() {
            setTimeout(() => {
            this.pinchZoom.isDragging = false;
        }, 10);
            this.pinchZoom.lastDist = 0;
            this.pinchZoom.lastCenter = null;
        }).bind(this));
	}

    difficulties() {

    }

    newGame(w, h, m) {
        this.field = new Field(w, h, m);
        this.field.create();
    }

    nonPolynomial() {

    }

    mute() {

    }
}