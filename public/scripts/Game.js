/*
Snake: Game Javascript
Copyright (C) 2019 Matthew Aguiar
Notes: The snake game was originally invented in 1997 by Nokia. This is my personal Javascript adaptation of the game.
*/

class Game
{
  /**
  * This constructor sets up all of the games essentials such as how big the canvas is, what game-state the game is in, the game's grid and the snake object.
  * @constructor
  * @param snake_length The initial length of the snake.
  * @param cell_size The size of the cells in the canvas.
  * @param delay The delay in milliseconds, the game should wait before processing another game-step.
  */
  constructor(snake_length, cell_size, delay)
  {
    ////// Initialize Instance Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.delay = -1;
    this.font_size = -1; //pt.
    this.game_state = GAMESTATE_ENUM.start;
    this.player_direction = DIRECTION.right;
    this.canvas_width = -1;
    this.canvas_height = -1;
    this.grid = null;
    this.snake = null;
    this.apple = null;
    this.welcome_message = "Welcome to the Snake game. Press 'enter' to start!";
    this.loss_message = "You lose. Press 'enter' to restart.";
    this.win_message = "You WIN!!! That's hard to do. Congratulations! Press 'enter' to restart.";
    ////// Adjust Canvas Dimensions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    console.log(CANVAS.clientWidth.toString() + "px", CANVAS.clientHeight.toString() + "px");
    this.set_canvas_width(this.adjust_canvas(CANVAS.clientWidth, parseInt(cell_size)));
    this.set_canvas_height(this.adjust_canvas(CANVAS.clientHeight, parseInt(cell_size)));
    CANVAS.style.width = this.get_canvas_width().toString() + "px";
    CANVAS.style.height = this.get_canvas_height().toString() + "px";
    CANVAS.width = this.get_canvas_width();
    CANVAS.height = this.get_canvas_height();
    console.log(CANVAS.style.width, CANVAS.style.height);
    ////// Set Delay /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_delay(delay);
    ////// Auto Adjust Font //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.adjust_font(this.welcome_message, 100);
    ////// Instantiate Grid //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_grid(new Grid(cell_size));
    ////// Setup Snake ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_snake(new Snake());
    this.init_snake_onto_grid(snake_length);
    ////// Setup Key Listener ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.addEventListener("keydown", this.key_handler.bind(this));
    ////// Begin Game Loop ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.game_loop();
    this.animation();
  }

  animation()
  {
    //Get next frame.
    requestAnimationFrame(this.animation.bind(this));
    CANVAS_CONTEXT.clearRect(0, 0, this.canvas_width, this.canvas_height);
    //
    switch(this.get_game_state())
    {
      case GAMESTATE_ENUM.start:
        CANVAS_CONTEXT.textAlign = "center";
        CANVAS_CONTEXT.fillText(this.welcome_message, this.get_canvas_width() / 2, this.get_canvas_height() / 2);
        break;

      case GAMESTATE_ENUM.ingame:
        for(let i = 0; i < this.get_grid().get_number_of_rows(); i++)
        {
          for(let j = 0; j < this.get_grid().get_number_columns_in_row(i); j++)
          {
            this.get_grid().get_cell(i, j).draw();
          }
        }
    }
  }

  game_loop()
  {
    setInterval(this.step.bind(this), this.get_delay());
  }

  step()
  {
    //console.log(this.get_game_state());
    if(this.get_game_state() == GAMESTATE_ENUM.ingame)
    {
      if(this.get_apple() == null)
      {
        this.place_apple();
      }
      var moved = this.move_snake(this.get_player_direction());
      if(moved)
      {
        let head = this.get_snake().get_head();
        let tail = this.get_snake().get_tail();
        this.get_grid().set_cell_occupancy(head.get_row(), head.get_column(), CELL_STATUS.empty);
        if(this.get_grid().get_cell_occupancy(head.get_row(), head.get_column()) == CELL_STATUS.apple)
        {
          this.set_apple(null);
          let row = tail.get_row();
          let column = tail.get_column();
          switch(tail.get_direction())
          {
            case DIRECTION.left:
              column--;
              break;

            case DIRECTION.right:
              column++;
              break;

            case DIRECTION.up:
              row--;
              break;

            case DIRECTION.down:
              row++;
          }
          this.get_snake().add_node(new SnakeNode(row, column, 'a'));
          this.get_grid().set_cell_occupancy();
        }
        this.get_grid().set_cell_occupancy(head.get_row(), head.get_column(), CELL_STATUS.snake);
        let win = this.is_win();
        if(win)
        {
          this.set_game_state(GAMESTATE_ENUM.win);
        }
      }
      else
      {
        this.set_game_state(GAMESTATE_ENUM.lose);
      }
    }
  }

  place_apple()
  {
    var random_coordinates = this.get_grid().filter_cells(CELL_STATUS.empty);
    if(random_coordinates.length > 0)
    {
      var chosen_coordinates = random_coordinates[Math.floor(Math.random() * random_coordinates.length)];
      var apple_row = chosen_coordinates[0];
      var apple_column = chosen_coordinates[1];
      this.set_apple(new Apple(apple_row, apple_column));
      this.get_grid().set_cell_occupancy(apple_row, apple_column, CELL_STATUS.apple);
    }
  }

  move_snake(direction)
  {
    var success = this.move_is_valid(direction);
    //
    if(success)
    {
      var node = this.get_snake().get_head().get_next();
      var previous_node = this.get_snake().get_head();
      for(let i = 1; i < this.get_snake().get_length(); i++)
      {
        let copy_of_current_node = node.copy();
        node.copy_properties_from_node(previous_node);
        node = node.get_next();
        previous_node = copy_of_current_node;
      }
      switch(direction)
      {
        case DIRECTION.left:
          this.get_snake().get_head().set_column(this.get_snake().get_head().get_column() - 1);
          break;

        case DIRECTION.right:
          this.get_snake().get_head().set_row(this.get_snake().get_head().get_column() + 1);
          break;

        case DIRECTION.up:
          this.get_snake().get_head().set_row(this.get_snake().get_head().get_row() - 1);
          break;

        case DIRECTION.down:
          this.get_snake().get_head().set_row(this.get_snake().get_head().get_row() + 1);
      }
      this.get_snake().get_head().set_direction(direction);
    }
    return success;
  }

  move_is_valid(direction)
  {
    var success = true;
    let head_row = this.get_snake().get_head().get_row();
    let head_column = this.get_snake().get_head().get_column();
    switch(direction)
    {
      case DIRECTION.left:
        console.log("LEFT");
        if(head_column - 1 < 0)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy(head_row, head_column - 1) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.right:
        console.log("RIGHT");
        if(head_column + 1 == this.get_grid().get_cells()[head_row].length)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy(head_row, head_column + 1) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.up:
        console.log("UP");
        if(head_row - 1 < 0)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy(head_row - 1, head_column) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.down:
        console.log("DOWN");
        if(head_row + 1 == this.get_grid().get_cells().length)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy(head_row + 1, head_column) == CELL_STATUS.snake)
        {
          success = false;
        }
    }
    return success;
  }

  is_win()
  {
    for(let i = 0; i < this.get_grid().get_cells().length; i++)
    {
      for(let j = 0; j < this.get_grid().get_cells()[i].length; j++)
      {
        if(this.get_grid().get_cell_occupancy(i, j) != CELL_STATUS.snake)
        {
          return false;
        }
      }
    }
    return true;
  }

  key_handler(event)
  {
    switch(event.which)
    {
      case 37:
        this.set_player_direction(DIRECTION.left);
        break;

      case 38:
        this.set_player_direction(DIRECTION.up);
        break;

      case 39:
        this.set_player_direction(DIRECTION.right);
        break;

      case 40:
        this.set_player_direction(DIRECTION.down);
        break;

      case 13:
        this.set_game_state(GAMESTATE_ENUM.ingame);
    }
  }

  init_snake_onto_grid(snake_length)
  {
    var remaining_snake = snake_length;
    var number_of_rows = this.get_grid().get_number_of_rows();
    var number_of_columns = -1;
    for(let i = number_of_rows - 1; i >= 0 ; i--)
    {
      number_of_columns = this.get_grid().get_number_columns_in_row(i);
      if(this.get_player_direction() == DIRECTION.right)
      {
        for(let j = 0; j < number_of_columns; j++)
        {
          if(remaining_snake == 0)
          {
            break;
          }
          else if(j == number_of_columns - 1)
          {
            this.get_snake().add_node(new SnakeNode(i, j, DIRECTION.up), 'p');
          }
          else
          {
            this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction()), 'p');
          }
          remaining_snake--;
          this.get_grid().set_cell_occupancy(i, j, CELL_STATUS.snake);
        }
        this.set_player_direction(DIRECTION.left);
      }
      else
      {
        for(let j = number_of_columns - 1; j >= 0; j--)
        {
          if(remaining_snake == 0)
          {
            break;
          }
          else if(j == 0)
          {
            this.get_snake().add_node(new SnakeNode(i, j, DIRECTION.up), 'p');
          }
          else
          {
            this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction()), 'p');
          }
          remaining_snake--;
          this.get_grid().set_cell_occupancy(i, j, CELL_STATUS.snake);
        }
        this.set_player_direction(DIRECTION.right);
      }
    }
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

  adjust_font(message, padding)
  {
    CANVAS_CONTEXT.font = "bold 750pt sans-serif";
    var text_width = CANVAS_CONTEXT.measureText(message).width;
    var font_size = 750;
    while(text_width > this.get_canvas_width() - padding * 2)
    {
      font_size--;
      CANVAS_CONTEXT.font = "bold " + font_size.toString() + "pt sans-serif";
      text_width = CANVAS_CONTEXT.measureText(message).width;
    }
  }

  get_canvas_width()
  {
    return this.canvas_width;
  }

  set_canvas_width(canvas_width)
  {
    if(canvas_width >= MIN_CELL_SIZE)
    {
      this.canvas_width = canvas_width;
    }
  }

  get_canvas_height()
  {
    return this.canvas_height;
  }

  set_canvas_height(canvas_height)
  {
    if(canvas_height >= MIN_CELL_SIZE)
    {
      this.canvas_height = canvas_height;
    }
  }

  get_delay()
  {
    return this.delay;
  }

  set_delay(delay)
  {
    if(delay > 0)
    {
      this.delay = delay;
    }
    else
    {
      this.delay = DEFAULT_DELAY;
    }
  }

  get_font_size()
  {
    return this.font_size;
  }

  set_font_size(font_size)
  {
    this.font_size = font_size;
  }

  get_game_state()
  {
    return this.game_state;
  }

  set_game_state(game_state_enum)
  {
    this.game_state = game_state_enum;
  }

  get_player_direction()
  {
    return this.player_direction;
  }

  set_player_direction(direction_enum)
  {
    this.player_direction = direction_enum;
  }

  get_grid()
  {
    return this.grid;
  }

  set_grid(grid_object)
  {
    this.grid = grid_object;
  }

  get_snake()
  {
    return this.snake;
  }

  set_snake(snake_object)
  {
    this.snake = snake_object;
  }

  get_apple()
  {
    return this.apple;
  }

  set_apple(apple_object)
  {
    this.apple = apple_object;
  }
}
