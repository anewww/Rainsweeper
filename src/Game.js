import Field from './Field.js'

export default class Game {
    constructor() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
            centeredScaling: true,
        });
        this.layer = new Konva.Layer();
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

    init() {
        // this.stage.scaleX(game.scale);
        // this.stage.scaleY(game.scale);
        this.stage.add(this.layer);

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
        this.stage.on('touchmove', (function(e) {
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
            this.pinchZoom.isDragging = false;
            this.pinchZoom.lastDist = 0;
            this.pinchZoom.lastCenter = null;
        }).bind(this));
	}

    newGame(w, h, m) {
        this.field = new Field(w, h, m);
        this.field.create();
        //this.field.generateMines(20);//(Number(this.inputMines.value));
        //this.field.reveal();

    }


}
