/*
Snake: Game Javascript
Copyright (C) 2019 Matthew Aguiar
Notes: The snake game was originally invented in 1997 by Nokia. This is my personal Javascript adaptation of the game.
*/

class Game
{
  /**
  * @constructor This constructor sets up ALL of the games essential data.
  * @param snake_length The initial length of the snake.
  * @param cell_size The size of the cells in the canvas.
  * @param delay The delay in milliseconds, the game should wait before processing another game-step.
  */
  constructor(snake_length, cell_size, delay)
  {
    ////// Initialize Instance Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.cell_size = -1;
    this.canvas_width = -1;
    this.canvas_height = -1;
    this.delay = -1;
    this.game_state = GAMESTATE_ENUM.start;
    this.start_game_function_reference = undefined;
    this.player_direction = undefined;
    this.grid = null;
    this.snake = null;
    this.apple = null;
    this.welcome_message = "";
    this.win_message = "";
    this.loss_message = "";
    this.font_size = -1; //pt.
    this.starting_snake_length = -1;
    ////// Adjust Canvas Dimensions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_cell_size(cell_size);
    this.resize_canvas_dimensions(this.get_cell_size());
    ////// Set Delay /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_delay(delay);
    ////// Setup Key Listeners ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_start_game_function_reference(this.handle_start_game_listener.bind(this));
    this.activate_start_game_listener();
    document.addEventListener("keydown", this.direction_handler.bind(this));
    ////// Setup Game Messages ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_welcome_message("Welcome to the Snake game. Press 'enter' to start!");
    this.set_win_message("You WIN!!! That's hard to do. Congratulations! Press 'enter' to restart.");
    this.set_loss_message("You lose. Press 'enter' to restart.")
    ////// Auto Adjust Font //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.adjust_font(this.get_welcome_message(), this.get_canvas_width() * 0.1); //Make the padding 10% of the canvas' width.
    ////// Initialize all Game Pieces ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_starting_snake_length(snake_length);
    this.init_game_pieces();
    ////// Begin Animation Loop //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.animation();
  }

  init_game_pieces()
  {
    ////// Set Initial Direction /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_player_direction(DIRECTION.right);
    ////// Instantiate Grid //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_grid(new Grid(this.get_cell_size()));
    ////// Setup Snake ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_snake(new Snake());
    this.init_snake_onto_grid(this.get_starting_snake_length());
    ////// Place Apple ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_apple(null);
    this.place_apple();
  }

  /**
  * @method animation Does not manage any objects in the game but the sole purpose of this funciton is to draw the start-up message, draw the snake and apple, or win/loss message depending on the
  * current state of the game.
  */
  animation()
  {
    ////// Get next Frame of Animation ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    requestAnimationFrame(this.animation.bind(this));
    CANVAS_CONTEXT.clearRect(0, 0, this.canvas_width, this.canvas_height);
    ////// Draw the Cells /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for(let i = 0; i < this.get_grid().get_number_of_rows(); i++)
    {
      for(let j = 0; j < this.get_grid().get_number_columns_in_row(i); j++)
      {
        this.get_grid().get_cell(i, j).draw();
      }
    }
    ////// Use Game State for Drawing Messages ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CANVAS_CONTEXT.textAlign = "center";
    CANVAS_CONTEXT.fillStyle = "black";
    switch(this.get_game_state())
    {
      case GAMESTATE_ENUM.start:
        CANVAS_CONTEXT.fillText(this.get_welcome_message(), this.get_canvas_width() / 2, this.get_canvas_height() / 2);
        break;

      case GAMESTATE_ENUM.lose:
        CANVAS_CONTEXT.fillText(this.get_loss_message(), this.get_canvas_width() / 2, this.get_canvas_height() / 2);
        break;

      case GAMESTATE_ENUM.win:
        CANVAS_CONTEXT.fillText(this.get_win_message(), this.get_canvas_width() / 2, this.get_canvas_height() / 2);
    }
  }

  /**
  * @method game_loop The main loop of the game that updates different aspects of the game such as moving the snake, placing the apple, and determining a win / loss. It processes
  * these things on an interval given by the delay in milliseconds passed into the object.
  */
  game_loop()
  {
    let loop_id = setInterval(
      function()
      {
          this.step(loop_id); //Call the step method with the id of this interval function so that it may be cleared if neccesary.
      }.bind(this), this.get_delay()); //this.get_delay() will return the amount of time in milliseconds before processing the next step.
  }

  /**
  * @method step This method will process each aspect of the game when it is called by the interval function above.
  * @param loop_id The id of the interval function above incase a win / loss state is met in which it needs to be cleared.
  */
  step(loop_id)
  {
    ////// Initialize Helpful Local Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let tail_row_before_move = this.get_snake().get_tail().get_row();
    let tail_column_before_move = this.get_snake().get_tail().get_column();
    let head_row_after_move = -1;
    let head_column_after_move = -1
    let tail_row_after_move = -1;
    let tail_column_after_move = -1;
    let direction_of_tail_after_move = undefined;
    let moved = false;
    ////// Attempt Move with Snake ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    moved = this.move_snake(this.get_player_direction())
    if(moved)
    {
      ////// Get Head and Tail Data after Move ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      head_row_after_move = this.get_snake().get_head().get_row();
      head_column_after_move = this.get_snake().get_head().get_column();
      tail_row_after_move = this.get_snake().get_tail().get_row();
      tail_column_after_move = this.get_snake().get_tail().get_column();
      direction_of_tail_after_move = this.get_snake().get_tail().get_direction();
      ////// Free up the Cell the Tail was Previously /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      this.get_grid().set_cell_occupancy(tail_row_before_move, tail_column_before_move, CELL_STATUS.empty); //Set the Cell tail before the movement to be empty since our snake has moved.
      ////// Check for Collision with Apple ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if(this.get_grid().get_cell_occupancy(head_row_after_move, head_column_after_move) == CELL_STATUS.apple)
      {
        this.set_apple(null); //If the head is now in a Cell that contains an apple, remove the apple.
        this.grow_snake(direction_of_tail_after_move, tail_row_after_move, tail_column_after_move); //Grow the snake.
      }
      this.get_grid().set_cell_occupancy(head_row_after_move, head_column_after_move, CELL_STATUS.snake); //NOTE: Important to have this after checking for apple collision so it won't override the Cell.
      ////// Check for Win //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let apple_placed = this.place_apple(); //Place the apple either because the game just started or it has been eaten. This function will NOT place a new apple if one already exists.
      if(!apple_placed)
      {
        this.end_game(GAMESTATE_ENUM.win, this.get_win_message());
        clearInterval(loop_id);
      }
    }
    else
    {
      ////// Trigger Loss ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      this.end_game(GAMESTATE_ENUM.lose, this.get_loss_message());
      clearInterval(loop_id);
    }
  }

  end_game(game_state, message)
  {
    this.set_game_state(game_state);
    this.activate_start_game_listener();
    this.adjust_font(message, this.get_canvas_width() * 0.1); //Make the padding 10% of the canvas' width.
  }

  /**
  * @method place_apple This will get an array of EMPTY cell coordinates that may be used to place an apple. One of those coordinates are then chosen at random and used to
  * instantiate a new apple object if one does not already exist.
  * @return Return true if the apple was places properly but false if there is no space to place an apple. Hence the player has won the game.
  */
  place_apple()
  {
    let success = true;
    if(this.get_apple() == null) //First test to make sure an apple object does not already exist.
    {
      let random_coordinates = this.get_grid().filter_cells(CELL_STATUS.empty); //Filter out an array of coordinates that contain an EMPTY Cell.
      if(random_coordinates.length > 0) //If there are availible cells, place the apple into a random one.
      {
        let chosen_coordinates = random_coordinates[Math.floor(Math.random() * random_coordinates.length)];
        let row = chosen_coordinates[0];
        let column = chosen_coordinates[1];
        this.set_apple(new Apple(row, column));
        this.get_grid().set_cell_occupancy(row, column, CELL_STATUS.apple);
      }
      else
      {
        success = false;
      }
    }
    return success;
  }

  /**
  * @method move_snake ...
  */
  move_snake(direction)
  {
    direction = this.force_non_reverse(direction);
    let success = this.move_is_valid(direction);
    if(success)
    {
      let node = this.get_snake().get_head().get_next();
      let previous_node = this.get_snake().get_head();
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
          this.get_snake().get_head().set_column(this.get_snake().get_head().get_column() + 1);
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

  /**
  * @method move_is_valid ...
  */
  move_is_valid(direction)
  {
    let success = true;
    let head_row = this.get_snake().get_head().get_row();
    let head_column = this.get_snake().get_head().get_column();
    let snake_head_direction = this.get_snake().get_head().get_direction();
    switch(direction)
    {
      case DIRECTION.left:
        if(this.get_snake() != DIRECTION.right)
        {
          if(head_column - 1 < 0)
          {
            success = false;
          }
          else if(this.get_grid().get_cell_occupancy(head_row, head_column - 1) == CELL_STATUS.snake)
          {
            success = false;
          }
        }
        break;

      case DIRECTION.right:
        if(head_column + 1 == this.get_grid().get_number_columns_in_row(head_row))
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy(head_row, head_column + 1) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.up:
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
        if(head_row + 1 == this.get_grid().get_number_of_rows())
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

  force_non_reverse(direction)
  {
    let snake_head_direction = this.get_snake().get_head().get_direction();
    if(snake_head_direction == DIRECTION.right && direction == DIRECTION.left)
    {
      direction = DIRECTION.right;
    }
    else if(snake_head_direction == DIRECTION.left && direction == DIRECTION.right)
    {
      direction = DIRECTION.left;
    }
    else if(snake_head_direction == DIRECTION.up && direction == DIRECTION.down)
    {
      direction = DIRECTION.up;
    }
    else if(snake_head_direction == DIRECTION.down && direction == DIRECTION.up)
    {
      direction = DIRECTION.down;
    }
    return direction;
  }

  grow_snake(direction_of_tail, tail_row, tail_column)
  {
    switch(direction_of_tail)
    {
      case DIRECTION.left:
        tail_column++;
        break;

      case DIRECTION.right:
        tail_column--;
        break;

      case DIRECTION.up:
        tail_row++;
        break;

      case DIRECTION.down:
        tail_row--;
    }
    this.get_snake().add_node(new SnakeNode(tail_row, tail_column, direction_of_tail), 'a');
    this.get_grid().set_cell_occupancy(tail_row, tail_column, CELL_STATUS.snake);
  }

  direction_handler(event)
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
    }
  }

  init_snake_onto_grid(snake_length)
  {
    let remaining_snake = snake_length;
    let number_of_rows = this.get_grid().get_number_of_rows();
    let number_of_columns = -1;
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
            this.set_player_direction(DIRECTION.left);
          }
          else
          {
            this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction()), 'p');
          }
          remaining_snake--;
          this.get_grid().set_cell_occupancy(i, j, CELL_STATUS.snake);
        }
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
            this.set_player_direction(DIRECTION.right);
          }
          else
          {
            this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction()), 'p');
          }
          remaining_snake--;
          this.get_grid().set_cell_occupancy(i, j, CELL_STATUS.snake);
        }
      }
    }
  }

  activate_start_game_listener()
  {
    document.addEventListener("keydown", this.get_start_game_function_reference());
  }

  handle_start_game_listener(event)
  {
      if(event.which == 13)
      {
        if(this.get_game_state() == GAMESTATE_ENUM.lose || this.get_game_state() == GAMESTATE_ENUM.win)
        {
          this.init_game_pieces(this.get_grid().get_cell_size());
        }
        this.set_game_state(GAMESTATE_ENUM.ingame);
        this.game_loop();
        document.removeEventListener("keydown", this.get_start_game_function_reference());
      }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////// Canvas Methods /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
  * @method resize_canvas_dimensions
  * @description This method is used to dynamically resize the canvas so that the dimensions of the canvas a divisible by how many rows and columns there are.
  * @param cell_size The size of the cell to adjust to.
  */
  resize_canvas_dimensions(cell_size)
  {
    ////// Initialize Helpful Local Variables ///////////////////////////////////////////////////////////////////////////////////////////////
    let canvas_dimensions = [parseInt(CANVAS.clientWidth), parseInt(CANVAS.clientHeight)];
    ////// Resize Canvas ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for(let i = 0; i < canvas_dimensions.length; i++)
    {
      let size_remainder = canvas_dimensions[i] % cell_size; //Get a remainder to check if the cell size divides evenly into the canvas width / height.
      while(size_remainder != 0) //Repeat this process until the remainder is 0.
      {
        canvas_dimensions[i]++;
        size_remainder = canvas_dimensions[i] % cell_size;
      }
    }
    this.canvas_width = canvas_dimensions[0];
    this.canvas_height = canvas_dimensions[1];
    CANVAS.width = this.canvas_width;
    CANVAS.style.width = this.canvas_width.toString() + "px";
    CANVAS.height = this.canvas_height;
    CANVAS.style.height = this.canvas_height.toString() + "px";
  }

  adjust_font(message, padding)
  {
    CANVAS_CONTEXT.font = "bold 750pt sans-serif";
    let text_width = CANVAS_CONTEXT.measureText(message).width;
    let font_size = 750;
    while(text_width > this.get_canvas_width() - padding * 2)
    {
      font_size--;
      CANVAS_CONTEXT.font = "bold " + font_size.toString() + "pt sans-serif";
      text_width = CANVAS_CONTEXT.measureText(message).width;
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////// Getters and Setters ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get_cell_size()
  {
    return this.cell_size;
  }

  set_cell_size(cell_size)
  {
    ////// Ensure Proper Cell Size /////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(cell_size < MIN_CELL_SIZE)
    {
      this.cell_size = parseInt(MIN_CELL_SIZE);
    }
    else if(cell_size > MAX_CELL_SIZE)
    {
      this.cell_size = parseInt(MAX_CELL_SIZE);
    }
    else
    {
      this.cell_size = parseInt(cell_size);
    }
  }

  /**
  * @method get_canvas_width
  * @return Return the width of the game's canvas.
  */
  get_canvas_width()
  {
    /**@type {natural}*/
    return this.canvas_width;
  }

  /**
  * @method get_canvas_height
  * @return Return the height of the game's canvas.
  */
  get_canvas_height()
  {
    /**@type {natural}*/
    return this.canvas_height;
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

  get_start_game_function_reference()
  {
    return this.start_game_function_reference;
  }

  set_start_game_function_reference(function_reference)
  {
    this.start_game_function_reference = function_reference;
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

  get_welcome_message()
  {
    return this.welcome_message;
  }

  set_welcome_message(message)
  {
    this.welcome_message = message;
  }

  get_win_message()
  {
    return this.win_message;
  }

  set_win_message(message)
  {
    this.win_message = message;
  }

  get_loss_message()
  {
    return this.loss_message;
  }

  set_loss_message(message)
  {
    this.loss_message = message;
  }

  get_starting_snake_length()
  {
    return this.starting_snake_length;
  }

  set_starting_snake_length(snake_length)
  {
    this.starting_snake_length = snake_length;
  }
}
