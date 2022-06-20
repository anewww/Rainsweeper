import Game from './Game.js'
import Rain from './Rain.js';
export { game }

const rainObj = new Rain();
rainObj.init();
rainObj.animloop();

new Game();
const game = Game.getInstance();
mediaQueries();
game.init();
const mines = 20;
const width = 12; //12 //15 //20
const height = 15; //15 //18 //20
game.newGame(width, height, mines, null);

setTimeout(() => {
    console.log('lightning')
    rainObj.clearCanvas3();
    rainObj.createLightning();
    rainObj.drawLightning();
}, 5000);






function mediaQueries() {
    // small
    if (window.matchMedia('(min-width: 576px)').matches) {
        adaptation(0.6, false);
    }
    // smaller than 576px - extrasmall
    else {
        adaptation(0.5, true);
    }
    // medium
    if (window.matchMedia('(min-width: 768px)').matches) {
        adaptation(0.6, false);
    }
    // large                              
    if (window.matchMedia('(min-width: 992px)').matches) {
        adaptation(0.7, false);
    }
    // xlarge
    if (window.matchMedia('(min-width: 1200px)').matches) {
        adaptation(0.8, false);
    }  
    // xxlarge 
    if (window.matchMedia('(min-width: 1400px)').matches) {
        adaptation(1, false);
    }

    function adaptation(scale, ismob) {
        game.scale = scale;
        game.isMobile = ismob;
        if (ismob) {
            game.stageMenu.height((window.innerWidth / 1920) * 600);
        }
        else {
            game.stageMenu.height((window.innerWidth / 1920) * 100);
        }
    }
}