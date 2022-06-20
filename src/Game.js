import Field from './Field.js'
import Button from './Button.js'
import { DifficultiesSwitcher, NPSwitcher, MuteSwitcher } from './Button.js';
import { game } from './main.js';

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
        this.menuImage = null;
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
        this.isMobile = false;
        this.isSolvable = false;
        this.buttons = [];
        this.audio = new Audio('./src/audio/rain.wav');
        this.lightSound = new Audio('./src/audio/lightning.wav');
    }

    static getInstance() {
        return this._instance;
    }

    init() {
        // audio
        this.audio.muted = true;
        this.lightSound.muted = true;

        this.audio.addEventListener("canplaythrough", event => {
            this.audio.loop = true;
        });

        // konva init stages and layers
        this.stage.add(this.layer);
        this.stage.add(this.layerField);
        this.stageMenu.add(this.layerMenu);

        // adaptation
        window.addEventListener('resize', () => {

        });
        // adaptation bg
        let body = document.getElementsByTagName('body');
        body[0].style.backgroundSize = window.innerWidth + 'px ' + window.innerHeight + 'px';

        // adaptation menu bar
        let menu = document.getElementById('menu');
        let menuOffsetY = window.innerHeight - this.stageMenu.height();
        menu.style.top = menuOffsetY + 'px';
        
        // adding the menu
        this.drawMenu();

        // get JSON
        this.getJson();

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

        // desktop drag
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey)
                this.stage.draggable(true);
        });
        window.addEventListener('keyup', (e) => {
            if (!e.ctrlKey)
                this.stage.draggable(false);
        });

        // desktop scaling
        let scaleBy = 1.1;
        this.stage.on('wheel', (e) => {
            // stop default scrolling
            e.evt.preventDefault();

            let oldScale = this.stage.scaleX();
            let pointer = this.stage.getPointerPosition();
            // let pointer = {
            //     x: this.stage.width() / 2,
            //     y: this.stage.height() / 2
            // };

            let mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = e.evt.deltaY > 0 ? -1 : 1;

            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            // if (e.evt.ctrlKey) {
            //     direction = -direction;
            // }

            let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            this.stage.scale({ x: newScale, y: newScale });

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.stage.position(newPos);
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
            }, 20);
            this.pinchZoom.lastDist = 0;
            this.pinchZoom.lastCenter = null;
        }).bind(this));
	}

    getJson() {
        const configPath = 'https://anewww.github.io/Rainsweeper/src/buttons-paths.json';
        async function fetchJson() {
            const response = await fetch(configPath);
            const json = await response.json();
            return json;
        }
        fetchJson().then((json) => {
            // let buttons = [];
            if (this.buttons[0])
                this.buttons[0] = new Button(0, new DifficultiesSwitcher(this.buttons[0].stateSwitcher.currentState), this.difficulties);
            else
                this.buttons[0] = new Button(0, new DifficultiesSwitcher(null), this.difficulties);
            this.buttons[1] = new Button(1, null, () => {this.newGame(this.field.width, this.field.height, this.field.mines, this.field.difficulty)});
            this.buttons[2] = new Button(2, null, this.field.regenerate);
            this.buttons[3] = new Button(3, null, this.field.reveal);
            this.buttons[4] = new Button(4, new NPSwitcher(), this.nonPolynomial);
            this.buttons[5] = new Button(5, new MuteSwitcher(), this.mute);
            this.buttons[6] = new Button(6, null, this.field.undo);

            for (let i = 0; i < 7; i++) {
                this.buttons[i].draw(i, json.paths[i]); 
                this.buttons[i].init();
            }   
        })
        // game.time.limit = json["timeLimit"];
    }

    difficulties() {
        
    }

    newGame(w, h, m, dif) {
        if (this.field) {
            this.field.image.destroy();
            for (let row of this.field.cells) {
                for (let cell of row) {
                    cell.image.destroy();
                    if (cell.text) {
                        cell.text.destroy();
                    }
                }
            }
        }
        this.field = new Field(w, h, m, dif);
        this.field.create();
        // this.getJson();
    }

    nonPolynomial() {

    }

    mute() {
        game.audio.play();
    }

    drawMenu() {
        let menuImgObj = new Image();
        if (!game.isMobile) {
            menuImgObj.src = './src/img/menu.png'
        }
        else {
            menuImgObj.src = './src/img/menu-mobile.png'
        }
        this.menuImage = new Konva.Image({
            x: 0,
            y: 0,
            image: menuImgObj,
            width: this.stageMenu.width(),
            height: this.stageMenu.height(),
        });
        this.layerMenu.add(this.menuImage);
    }
}