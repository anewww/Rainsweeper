import Game from './Game.js'
export { game }

let game = new Game();
game.init();
let mines = 20;
let width = 12;
let height = 15;
game.newGame(width, height, mines);
//game.field.reveal();
