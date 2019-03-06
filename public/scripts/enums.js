
const GAMESTATE_ENUM = Object.freeze({"start":0, "ingame":1, "win":2, "lose":3});
const CELL_STATUS = Object.freeze({"empty":0, "snake":1, "apple":2});
const DIRECTION = Object.freeze({"left":0, "right":1, "up":2, "down":3});
//const SNAKE_SIZE = Object.freeze({"small":16, "medium":32, "large": 64});
var CANVAS = document.getElementById("game-window");
