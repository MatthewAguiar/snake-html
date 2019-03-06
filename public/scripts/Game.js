
class Game
{
  constructor(cell_size, delay)
  {
    this.delay = delay;
    //TODO: TRY EXCEPT FOR CELL SIZE???
    //Setup Canvas.
    cell_size = parseInt(cell_size);
    this.canvas_width = parseInt(CANVAS.clientWidth);
    this.canvas_height = parseInt(CANVAS.clientHeight);
    console.log(this.canvas_width.toString() + "px", this.canvas_height.toString() + "px");
    //this.test_adjust_canvas(this.min_cell_size, this.max_cell_size, this.min_cell_size, 2048);
    this.canvas_width = this.adjust_canvas(this.canvas_width, cell_size);
    this.canvas_height = this.adjust_canvas(this.canvas_height, cell_size);
    //console.log(canvas_width, canvas_height);
    CANVAS.style.width = this.canvas_width.toString() + "px";
    CANVAS.style.height = this.canvas_height.toString() + "px";
    console.log(CANVAS.style.width, CANVAS.style.height);
    //Create Game Grid.
    this.grid = new Grid(cell_size);
    //Create Snake.
    this.snake = new Snake();
  }

  adjust_canvas(size, cell_size)
  {
    var size_remainder = size % cell_size;
    while(size_remainder != 0)
    {
      size++;
      size_remainder = size % cell_size;
    }
    return size;
  }

  get_grid()
  {
    return this.grid;
  }
}

var game_app = new Game(32, 1000);
var test_utility = new UnitTester(game_app);
