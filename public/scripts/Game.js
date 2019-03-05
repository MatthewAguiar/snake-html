
class Game
{
  constructor(snake_size, delay)
  {
    this.delay = delay;
    this.grid = new Grid(snake_size);
  }
}

var game_app = new Game(32, 1000);
