class Game
{
  /**
  * @constructor This constructor sets up ALL of the games essential data.
  * @param snake_length The initial length of the snake.
  * @param cell_size The size of the cells in the canvas.
  * @param delay The delay in milliseconds, the game should wait before processing another game-step.
  */
  constructor(snake_length, cell_size, speed, colors, background, music)
  {
    ////// Initialize Instance Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.canvas_width = -1;
    this.canvas_height = -1;
    this.cell_size = -1;
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
    this.font_size = -1; //in pts.
    this.starting_snake_length = -1;
    this.background = "";
    this.music = "";
    ////// Adjust Canvas Dimensions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_cell_size(cell_size);
    this.resize_canvas_dimensions(this.get_cell_size());
    this.set_background(background);
    this.set_music(music);
    ////// Set Delay /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_delay(speed);
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
    this.init_game_pieces(colors);
    ////// Begin Animation Loop //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.animation();
  }

  /**
  * @method init_game_pieces
  * @description Reset the entire game to the starting state!
  * @param {Array.<string>} colors The array of colors which the snake will be composed of.
  */
  init_game_pieces(colors)
  {
    ////// Set Initial Direction /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_player_direction(DIRECTION.right);
    ////// Instantiate Grid //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_grid(new Grid(this.get_cell_size()));
    ////// Setup Snake ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_snake(new Snake(colors));
    this.init_snake_onto_grid(this.get_starting_snake_length());
    ////// Place Apple ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_apple(null);
    this.place_apple();
  }

  /**
  * @method animation
  * @description Does not manage any objects in the game but the sole purpose of this funciton is to draw the start-up message, draw the snake and apple, or win/loss message depending on the
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
    //Display different messages based on the state the game is in.
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
  * @method game_loop
  * @description The main loop of the game that updates different aspects of the game such as moving the snake, placing the apple, and determining a win / loss. It processes
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
  * @param {integer} loop_id The id of the interval function above incase a win / loss state is met in which it needs to be cleared.
  */
  step(loop_id)
  {
    ////// Initialize Helpful Local Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let tail_row_before_move = this.get_snake().get_tail().get_row();
    let tail_column_before_move = this.get_snake().get_tail().get_column();
    let head_row_after_move = -1;
    let direction_of_tail_after_move = undefined;
    let moved = false;
    ////// Attempt Move with Snake ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    moved = this.move_snake(this.get_player_direction());
    if(moved)
    {
      ////// Get Head and Tail Data after Move ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      head_row_after_move = this.get_snake().get_head().get_row();
      head_column_after_move = this.get_snake().get_head().get_column();
      direction_of_tail_after_move = this.get_snake().get_tail().get_direction();
      ////// Free up the Cell the Tail was Previously /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      this.get_grid().set_cell_occupant(tail_row_before_move, tail_column_before_move, null); //Set the Cell tail before the movement to be empty since our snake has moved.
      ////// Check for Collision with Apple ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if(this.get_grid().get_cell_occupancy_status(head_row_after_move, head_column_after_move) == CELL_STATUS.apple)
      {
        this.set_apple(null); //If the head is now in a Cell that contains an apple, remove the apple.
        this.grow_snake(); //Grow the snake.
        this.get_snake().get_eat_sound().play();
      }
      this.get_grid().set_cell_occupant(head_row_after_move, head_column_after_move, this.get_snake().get_head()); //NOTE: Important to have this after checking for apple collision so it won't override the Cell.
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

  /**
  * @method end_game
  * @description This will reactivate the start game press enter listener as well as readjust font and gamestate.
  * @param {GAMESTATE_ENUM} game_state The gamestate to reset to.
  * @param {string} message The message to display on the canvas.
  */
  end_game(game_state, message)
  {
    this.set_game_state(game_state);
    this.activate_start_game_listener();
    this.adjust_font(message, this.get_canvas_width() * 0.1); //Make the padding 10% of the canvas' width.
  }

  /**
  * @method place_apple This will get an array of EMPTY cell coordinates that may be used to place an apple. One of those coordinates are then chosen at random and used to
  * instantiate a new apple object if one does not already exist.
  * @return {boolean} Return true if the apple was places properly but false if there is no space to place an apple. Hence the player has won the game.
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
        this.get_grid().set_cell_occupant(row, column, this.get_apple());
      }
      else
      {
        success = false;
      }
    }
    return success;
  }

  /**
  * @method move_snake
  * @description Shifts the properties such as row, column and direction down the chain of SnakeNodes and also moves the head to the proper coordinates.
  * @param {DIRECTION} direction The direction the head will be moving in.
  * @return {boolean} True if the move is valid within the grid and false if not such as going off the grid or crashing into yourself.
  */
  move_snake(direction)
  {
    direction = this.force_non_reverse(direction); //Do not allow the snake to reverse! Would cause a loss that is not fair.
    let success = this.move_is_valid(direction); //Is the move valid?
    if(success)
    {
      let node = this.get_snake().get_head().get_next(); //Get the SnakeNode after the head.
      let previous_node = this.get_snake().get_head(); //Get the head.
      for(let i = 1; i < this.get_snake().get_length(); i++)
      {
        let copy_of_current_node = node.copy(); //Make a deep copy of the current node as it will now have its properties manipulated.
        node.copy_properties_from_node(previous_node); //Copy the properties (row, column, direction) from the previous SnakeNode to the next!
        this.get_grid().set_cell_occupant(node.get_row(), node.get_column(), node); //Set the Cell tail before the movement to be empty since our snake has moved.
        node = node.get_next(); //Get the next SnakeNode.
        previous_node = copy_of_current_node; //Save the deepcopy of the node that was just changed so that the original info may be copied to the next node.
      }
      //Now move the head in the proper direction by changing its row or column by 1. This is after all SnakeNodes have had their properties shifted down 1.
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
      this.get_snake().get_head().set_direction(direction); //Reset the head to its NEW direciton.
    }
    return success;
  }

  /**
  * @method move_is_valid
  * @description Checks if the move that wants to be made is possible.
  * @param {DIRECTION} direction The direction in which to check the movement in.
  * @return {boolean} Return true if the move may be made and false if not.
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
        if(head_column - 1 < 0)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy_status(head_row, head_column - 1) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.right:
        if(head_column + 1 == this.get_grid().get_number_columns_in_row(head_row))
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy_status(head_row, head_column + 1) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.up:
        if(head_row - 1 < 0)
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy_status(head_row - 1, head_column) == CELL_STATUS.snake)
        {
          success = false;
        }
        break;

      case DIRECTION.down:
        if(head_row + 1 == this.get_grid().get_number_of_rows())
        {
          success = false;
        }
        else if(this.get_grid().get_cell_occupancy_status(head_row + 1, head_column) == CELL_STATUS.snake)
        {
          success = false;
        }
    }
    return success;
  }

  /**
  * @method force_non_reverse
  * @description In order to not accidentally run in the opposite direction of current motion and lose, this function changes the input direction to the opposite direction if needed.
  * @param {DIRECTION} direciton The desired direction to move in.
  * @return {DIRECTION} Returns the direction the snake will be moving in so that it will not crash back in on itself.
  */
  force_non_reverse(direction)
  {
    let snake_head_direction = this.get_snake().get_head().get_direction();
    //Simply compare the desired direction with the direction of the snake's head and deternmine if the returned diection must be flipped.
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

  /**
  * @method grow_snake
  * @description Appends a new SnakeNode onto the end of the snake.
  */
  grow_snake()
  {
    //Store tail properties in variables to properly attach a new tail.
    let tail_direction = this.get_snake().get_tail().get_direction();
    let tail_row = this.get_snake().get_tail().get_row();
    let tail_column = this.get_snake().get_tail().get_column();
    switch(tail_direction)
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
    this.get_snake().add_node(new SnakeNode(tail_row, tail_column, direction_of_tail); //Add the new SnakeNode onto the end of the snake given the current tail's properties!
    this.get_grid().set_cell_occupant(tail_row, tail_column, this.get_snake().get_tail()); //Update grid status as well.
  }

  /**
  * @method direction_handler
  * @description This function sets the Game object's direction variables to the keyboard input.
  * @param {event} event This object contains information about an event which is a keypress here. We can extract info from it such as what key was pressed.
  */
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

  /**
  * @method init_snake_onto_grid
  * @description Takes the starting length of the snake and creates the SnakeNodes as well as updating the grid.
  * @param {natural} snake_length The length of a snake.
  */
  init_snake_onto_grid(snake_length)
  {
    let number_of_rows = this.get_grid().get_number_of_rows();
    let number_of_columns = -1;
    let remaining_cells = number_of_rows * this.get_grid().get_number_columns_in_row(0);
    let lay_snake = false;
    for(let i = 0; i < number_of_rows; i++)
    {
      number_of_columns = this.get_grid().get_number_columns_in_row(i);
      if(this.get_player_direction() == DIRECTION.left)
      {
        for(let j = 0; j < number_of_columns; j++)
        {
          if(remaining_cells == snake_length) //Once the remaining cells is equal to the number of SnakeNodes needing to be layed set the snake_lay var to true.
          {
            lay_snake = true;
          }
          if(lay_snake)
          {
            if(j == 0 && i > 0)
            {
              this.get_snake().add_node(new SnakeNode(i, j, DIRECTION.up)); //If the snake is in a left corner except for at the top of the grid, make that node move up.
            }
            else
            {
              this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction())); //Otherwise just set the direction to the current Game direction.
            }
          }
          if(j == number_of_columns - 1)
          {
            this.set_player_direction(DIRECTION.right); //If we've reached the last column in a row, change the Game's direction.
          }
          this.get_grid().set_cell_occupant(i, j, this.get_snake().get_tail());
          remaining_cells--;
        }
      }
      else
      {
        for(let j = number_of_columns - 1; j >= 0; j--)
        {
          if(remaining_cells == snake_length)
          {
            lay_snake = true; //Once the remaining cells is equal to the number of SnakeNodes needing to be layed set the snake_lay var to true.
          }
          if(lay_snake)
          {
            if(j == number_of_columns - 1)
            {
              this.get_snake().add_node(new SnakeNode(i, j, DIRECTION.up)); //If the SnakeNode is to be added to the last column in a row, that node must move UP.
            }
            else
            {
              this.get_snake().add_node(new SnakeNode(i, j, this.get_player_direction())); //Otherwise just set the direction to the current Game direction.
            }
          }
          if(j == 0 && i != number_of_rows - 1)
          {
            this.set_player_direction(DIRECTION.left); //Once the first column is hit change the Game's direction.
          }
          this.get_grid().set_cell_occupant(i, j, this.get_snake().get_tail());
          remaining_cells--;
        }
      }
    }
  }

  /**
  * @method activate_start_game_listener
  * @description This will activate the state of game event listener that listens for the ENTER key.
  */
  activate_start_game_listener()
  {
    document.addEventListener("keydown", this.get_start_game_function_reference());
  }

  /**
  * @method handle_start_game_listener
  * @param {event} event The event that contains information about a keypress such as which one was pressed.
  */
  handle_start_game_listener(event)
  {
      if(event.which == 13)
      {
        if(this.get_game_state() == GAMESTATE_ENUM.lose || this.get_game_state() == GAMESTATE_ENUM.win)
        {
          this.init_game_pieces(this.get_snake().get_color_queue());
        }
        this.set_game_state(GAMESTATE_ENUM.ingame);
        this.game_loop();
        document.removeEventListener("keydown", this.get_start_game_function_reference());
      }
  }

  /**
  * @method resize_canvas_dimensions
  * @description This method is used to dynamically resize the canvas so that the dimensions of the canvas a divisible by how many rows and columns there are.
  * @param {natural} cell_size The size of the cell to adjust to.
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

  /**
  * @method adjust_font
  * @param {string} message The message to adjust the font according to.
  * @param {number} padding The padding to allow on either side of the text in px.
  */
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

  /**
  * @method get_canvas_width
  * @return {natural} Return the width of the game's canvas.
  */
  get_canvas_width()
  {
    return this.canvas_width;
  }

  /**
  * @method get_canvas_height
  * @return {natural} Return the height of the game's canvas.
  */
  get_canvas_height()
  {
    return this.canvas_height;
  }

  /**
  * @method get_cell_size
  * @return {natural} Return the size of the cells in the canvas.
  */
  get_cell_size()
  {
    return this.cell_size;
  }

  /**
  * @method set_cell_size
  * @param {natural} cell_size The size of the cells in the canvas.
  */
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
  * @method get_delay
  * @return {natural} Return the number of milliseconds that the Game waits before performing the next step.
  */
  get_delay()
  {
    return this.delay;
  }

  /**
  * @method set_delay
  * @param {natural} delay Set the delay in milliseconds the Game will wait between steps.
  */
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

  /**
  * @method get_font_size
  * @return {number} Return the size of the current font size on the Canvas.
  */
  get_font_size()
  {
    return this.font_size;
  }

  /**
  * @method set_font_size
  * @param {number} font_size The size of the font to set the canvas to have.
  */
  set_font_size(font_size)
  {
    this.font_size = font_size;
  }

  /**
  * @method get_game_state
  * @return {number} Return the current state of the game.
  */
  get_game_state()
  {
    return this.game_state;
  }

  /**
  * @method set_game_state
  * @param {GAMESTATE_ENUM} game_state_enum The GameState the game should currently be in.
  */
  set_game_state(game_state_enum)
  {
    this.game_state = game_state_enum;
  }

  /**
  * @method get_start_game_function_reference
  * @return {function} Return the reference to the proper function that enables the start of game keyhandler. (activate_start_game_listener)
  */
  get_start_game_function_reference()
  {
    return this.start_game_function_reference;
  }

  /**
  * @method set_start_game_function_reference
  * @param {function} function_reference The reference to the desired funciton that will activate the start of game keyhandler.
  */
  set_start_game_function_reference(function_reference)
  {
    this.start_game_function_reference = function_reference;
  }

  /**
  * @method get_player_direction
  * @return {DIRECTION} Return the players current direction.
  */
  get_player_direction()
  {
    return this.player_direction;
  }

  /**
  * @method set_player_direction
  * @param {DIRECTION} direction_enum The direction to set the Game's direction variable to.
  */
  set_player_direction(direction_enum)
  {
    this.player_direction = direction_enum;
  }

  /**
  * @method get_grid
  * @return {Grid} Return the Game's grid of game pieces.
  */
  get_grid()
  {
    return this.grid;
  }

  /**
  * @method set_grid
  * @param {Grid} grid_object The grid object to store.
  */
  set_grid(grid_object)
  {
    this.grid = grid_object;
  }

  /**
  * @method get_snake
  * @return {Snake} Returns the Game's snake.
  */
  get_snake()
  {
    return this.snake;
  }

  /**
  * @method set_snake
  * @param {Snake} snake_object The snake object to associate with the Game.
  */
  set_snake(snake_object)
  {
    this.snake = snake_object;
  }

  /**
  * @method get_apple
  * @return {Apple} Return the Game's apple object.
  */
  get_apple()
  {
    return this.apple;
  }

  /**
  * @method set_apple
  * @param {Apple} apple_object The apple object to store as the Game's apple.
  */
  set_apple(apple_object)
  {
    this.apple = apple_object;
  }

  /**
  * @method get_welcome_message
  * @return {string} Return the Game's welcome message.
  */
  get_welcome_message()
  {
    return this.welcome_message;
  }

  /**
  * @method set_welcome_message
  * @param {string} message The desired welcome message.
  */
  set_welcome_message(message)
  {
    this.welcome_message = message;
  }

  /**
  * @method get_win_message
  * @return {string} Return the Game's win message.
  */
  get_win_message()
  {
    return this.win_message;
  }

  /**
  * @method set_win_message
  * @param {string} message The desired win message.
  */
  set_win_message(message)
  {
    this.win_message = message;
  }

  /**
  * @method get_loss_message
  * @return {string} Return the Game's loss message.
  */
  get_loss_message()
  {
    return this.loss_message;
  }

  /**
  * @method set_win_message
  * @param {string} message The desired loss message.
  */
  set_loss_message(message)
  {
    this.loss_message = message;
  }

  /**
  * @method get_starting_snake_length
  * @return {natural} Return the number of SnakeNodes the snake should originally start with.
  */
  get_starting_snake_length()
  {
    return this.starting_snake_length;
  }

  /**
  * @method set_starting_snake_length
  * @param {natural} snake_length The starting length of the snake.
  */
  set_starting_snake_length(snake_length)
  {
    let number_of_cells = (CANVAS.width / this.get_cell_size()) * (CANVAS.height / this.get_cell_size());
    if(snake_length >= number_of_cells) //Ensure the starting length doesn't exceed the number of cells in the grid minus 1.
    {
      snake_length = number_of_cells - 1;
    }
    this.starting_snake_length = snake_length;
  }

  /**
  * @method get_background
  * @return {string} Return the background image path.
  */
  get_background()
  {
    return this.background;
  }

  /**
  * @method set_background
  * @param {string} background The path to the background image.
  */
  set_background(background)
  {
    document.body.style.backgroundImage = "url(" + background + ")";
    this.background = background;
  }

  /**
  * @method get_music
  * @return {string} Return path to a music file.
  */
  get_music()
  {
    return this.background;
  }

  /**
  * @method set_music
  * @param {string} music The path to a music file.
  */
  set_music(music)
  {
    let embed_tag = document.createElement("embed");
    embed_tag.src = music;
    embed_tag.autoplay = true;
    embed_tag.loop = true;
    document.body.insertBefore(embed_tag, document.getElementById("game-window"));
    this.music = music
  }
}
