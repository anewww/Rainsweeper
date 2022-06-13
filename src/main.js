import Game from './Game.js'
export { game }

new Game();
const game = Game.getInstance();
mediaQueries();
game.init();
const mines = 30;
const width = 12; //12 //15 //20
const height = 15; //15 //18 //20
game.newGame(width, height, mines);




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