import Field from './Field.js'
//import { game } from './main.js'

export default class Game {
    constructor() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true,
        });
        this.layer = new Konva.Layer();
        this.cellStatus = {
            mine: 'mine',
            empty: 'mt',
            number: 'num',
        }
        this.field = null;
    }

    init() {
        Konva.hitOnDragEnabled = true;

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
        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
    
        function getCenter(p1, p2) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };
        }

        let lastCenter = null;
        let lastDist = 0;
        let bindTouchHandler = touchHandler.bind(this);
        this.stage.on('touchstart', bindTouchHandler);
        function touchHandler(e) {
            console.log('lastcenter' + lastCenter)
            e.evt.preventDefault();
            let touch1 = e.evt.touches[0];
            let touch2 = e.evt.touches[1];
            console.log(touch1)

            if (touch1 && touch2) {
                console.log('two touches')
                // if the stage was under Konva's drag&drop
                // we need to stop it, and implement our own pan logic with two pointers
                if (this.stage.isDragging()) {
                    console.log('isDragging')
                    this.stage.stopDrag();
                }
                let p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                let p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };
                if (!lastCenter) {
                    console.log('!lastCenter' + lastCenter)
                    lastCenter = getCenter(p1, p2);
                    console.log(lastCenter)
                    return;
                }
                let newCenter = getCenter(p1, p2);
                let dist = getDistance(p1, p2);
                if (!lastDist) {
                    console.log('!lastDist')
                    lastDist = dist;
                }
                // local coordinates of center point
                let pointTo = {
                    x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
                    y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
                };

                console.log(this.stage.scaleX() + ' ' + dist + ' ' + lastDist)
                let scale = this.stage.scaleX() * (dist / lastDist);
                console.log(scale)
                this.stage.scaleX(scale);
                this.stage.scaleY(scale);

                // calculate new position of the stage
                let dx = newCenter.x - lastCenter.x;
                let dy = newCenter.y - lastCenter.y;

                let newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };
                console.log(newPos)
                this.stage.position(newPos);

                lastDist = dist;
                lastCenter = newCenter;
            }
        }

        this.stage.on('touchend', function () {
            lastDist = 0;
            lastCenter = null;
        });

        this.stage.add(this.layer);

	}

    newGame(w, h, m) {
        this.field = new Field(w, h, m);
        this.field.create();
        //this.field.generateMines(20);//(Number(this.inputMines.value));
        //this.field.reveal();

    }


}
