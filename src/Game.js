import Field from './Field.js'
import PinchZoom from './lib/pinch-zoom.js'
//import { game } from './main.js'

export default class Game {
    constructor() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
            //draggable: true,
        });
        this.layer = new Konva.Layer();
        this.cellStatus = {
            mine: 'mine',
            empty: 'mt',
            number: 'num',
        }
        this.field = null;
        this.lastCenter = null;
        this.lastDist = 0;
    }

    init() {
        //Konva.hitOnDragEnabled = true;

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

        this.stage.add(this.layer);

        // let el = document.querySelector('#container');
        // let pinchz = new PinchZoom(el, {
        //     tapZoomFactor: 2,
        //     zoomOutFactor: 1.3,
        //     maxZoom: 4,
        //     minZoom: 0.5,
        // });
        // pinchz.enable();

        // mobile scaling
        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
    
        function getCenter(p1, p2) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };
        }
 
        //let bindTouchHandler = touchHandler.bind(this);
        this.stage.on('touchmove', touchHandler.bind(this));
        
        function touchHandler(e) {
            e.evt.preventDefault();
            let touch1 = e.evt.touches[0];
            let touch2 = e.evt.touches[1];

            if (touch1 && touch2) {
                // if the stage was under Konva's drag&drop
                // we need to stop it, and implement our own pan logic with two pointers
                // if (this.stage.isDragging()) {
                //     this.stage.stopDrag();
                // }
                let p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                let p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };
                if (!this.lastCenter) {
                    this.lastCenter = getCenter(p1, p2);
                    return;
                }
                let newCenter = getCenter(p1, p2);
                let dist = getDistance(p1, p2);
                if (!this.lastDist) {
                    this.lastDist = dist;
                }
                // local coordinates of center point
                let pointTo = {
                    x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
                    y: (newCenter.y - this.stage.y()) / this.stage.scaleY(),
                };

                let scale = this.stage.scaleX() * (dist / this.lastDist);
                this.stage.scaleX(scale);
                this.stage.scaleY(scale);

                // calculate new position of the stage
                let dx = newCenter.x - this.lastCenter.x;
                let dy = newCenter.y - this.lastCenter.y;

                let newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };
                this.stage.position(newPos);

                this.lastDist = dist;
                this.lastCenter = newCenter;
            }
        }

        this.stage.on('touchend', function () {
            this.lastDist = 0;
            this.lastCenter = null;
        });
	}

    newGame(w, h, m) {
        this.field = new Field(w, h, m);
        this.field.create();
        //this.field.generateMines(20);//(Number(this.inputMines.value));
        //this.field.reveal();

    }


}
