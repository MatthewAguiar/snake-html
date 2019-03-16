/**
* An object used to manage a linked-list of SnakeNode objects.
* @class
*/
class Snake
{
  /**
  * @constructor
  * @description Sets up head and tail of linked-list as well as the snakes length, queue of colors and the apple eating sound effect.
  * @param {Array.<string>} colors An array of strings which will be saved as a queue of colors to make added SnakeNodes.
  */
  constructor(colors)
  {
    this.head = this.tail = null;
    this.length = 0;
    this.color_queue = [];
    this.eat_fx = null;
    this.set_color_queue(colors);
    this.shuffle_queue();
    this.set_eat_sound(new Audio("audio/sound-effects/apple-bite.wav"));
  }

  /**
  * @method add_node
  * @description Appends a SnakeNode object to the end of the linked-list.
  * @param {SnakeNode} node The SnakeNode that is to be appended.
  */
  add_node(node)
  {
    if(this.head == null && this.tail == null)
    {
      this.head = node; //If the linked-list doesn't even contain any nodes, the head and tail will both point to the new node.
      this.tail = this.head;
    }
    else
    {
      this.tail.set_next(node); //Otherwise set the current tail's next pointer to the node.
      node.set_previous(this.tail); //Set the previous pointer of the node to the current tail.
      this.tail = node; //And just move the current tail pointer to that new node after the other pointers are all shifted.
    }
    node.set_color(this.get_next_color());
    this.length++;
  }

  /**
  * @method shuffle_queue
  * @description Shuffles the queue of color strings so that sequences are not always the same.
  */
  shuffle_queue()
  {
    let current_color_index, swap_color_index, place_holder;
    swap_color_index = -1;
    place_holder = "";
    for(current_color_index = this.get_color_queue().length - 1; current_color_index > 0; current_color_index--) //Start at end of color queue and work down.
    {
      swap_color_index = Math.floor(Math.random() * (current_color_index + 1)); //Get a random index in the queue to swap colors with.
      place_holder = this.get_color_queue()[current_color_index]; //Save the color of the current index in a place holder so the swap color may be moved in.
      this.get_color_queue()[current_color_index] = this.get_color_queue()[swap_color_index]; //SWAP.
      this.get_color_queue()[swap_color_index] = place_holder; //Replace the index from which the color was swapped from with the place holder color.
    }
  }

  /**
  * @method get_length
  * @return {natural} Return the length of the snake.
  */
  get_length()
  {
    return this.length;
  }

  /**
  * @method set_length
  * @param {natural} length The length to set the snake's length variable to.
  */
  set_length(length)
  {
    this.length = length;
  }

  /**
  * @method get_head
  * @return {SnakeNode} Get the head of the snake.
  */
  get_head()
  {
    return this.head;
  }

  /**
  * @method set_head
  * @param {SnakeNode} head A SnakeNode to made the head of the snake.
  */
  set_head(head)
  {
    this.head = head;
  }

  /**
  * @method get_tail
  * @return {SnakeNode} Returns the tail of the snake.
  */
  get_tail()
  {
    return this.tail;
  }

  /**
  * @method set_tail
  * @param {SnakeNode} tail The SnakeNode to be the snake's tail.
  */
  set_tail(tail)
  {
    this.tail = tail;
  }

  /**
  * @method get_next_color
  * @return {string} Dequeues the next color in the color queue.
  */
  get_next_color()
  {
    let color = this.get_color_queue().shift();
    this.get_color_queue().push(color); //Push the color back onto the end of the queue.
    return color;
  }

  /**
  * @method get_color_queue
  * @return {Array.<string>} Returns entire queue of colors.
  */
  get_color_queue()
  {
    return this.color_queue;
  }

  /**
  * @method get_color_queue
  * @param {Array.<string>} colors The color array to make into a color queue.
  */
  set_color_queue(colors)
  {
    this.color_queue = colors;
  }

  /**
  * @method get_eat_sound
  * @return {Audio} Returns the Audio object associated with the apple eating sound effect.
  */
  get_eat_sound()
  {
    return this.eat_fx;
  }

  /**
  * @method set_eat_sound
  * @param {Audio} audio_object The Audio object that contains a sound effect.
  */
  set_eat_sound(audio_object)
  {
    this.eat_fx = audio_object;
  }
}
