import Game from './Game.js'
export { game }

let game = new Game();
mediaQueries();
game.init();
let mines = 20;
let width = 12;
let height = 15;
game.newGame(width, height, mines);
// game.stage.scaleX(2);
// game.stage.scaleY(2); 
//game.field.reveal();



function mediaQueries() {
    // small
    if (window.matchMedia('(min-width: 576px)').matches) {
        game.scale = 0.6;
    }
    // smaller than 576px - extrasmall
    else {
        game.scale = 0.5;
    }
    // medium
    if (window.matchMedia('(min-width: 768px)').matches) {
        game.scale = 0.6;
    }
    // large                              
    if (window.matchMedia('(min-width: 992px)').matches) {
        game.scale = 0.7;
    }
    // xlarge
    if (window.matchMedia('(min-width: 1200px)').matches) {
        game.scale = 1;
    }  
    // xxlarge 
    if (window.matchMedia('(min-width: 1400px)').matches) {
        game.scale = 1;
    }
}
