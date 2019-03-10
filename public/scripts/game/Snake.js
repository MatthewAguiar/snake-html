
class Snake
{
  constructor(colors)
  {
    this.head = this.tail = null;
    this.length = 0;
    this.color_queue = [];
    this.set_color_queue(colors);
    this.shuffle_queue();
  }

  add_node(node, order)
  {
    if(this.head == null && this.tail == null)
    {
      this.head = node;
      this.tail = this.head;
    }
    else
    {
      this.tail.set_next(node);
      node.set_previous(this.tail);
      this.tail = node;
    }
    node.set_color(this.get_next_color());
    this.length++;
  }

  get_length()
  {
    return this.length;
  }

  set_length(length)
  {
    this.length = length;
  }

  get_head()
  {
    return this.head;
  }

  set_head(head)
  {
    this.head = head;
  }

  get_tail()
  {
    return this.tail;
  }

  set_tail(tail)
  {
    this.tail = tail;
  }

  get_next_color()
  {
    let color = this.get_color_queue().shift();
    this.get_color_queue().push(color);
    return color;
  }

  get_color_queue()
  {
    return this.color_queue;
  }

  set_color_queue(colors)
  {
    this.color_queue = colors;
  }

  shuffle_queue()
  {
    let current_color_index, swap_color_index, place_holder;
    swap_color_index = 0;
    place_holder = "";
    for(current_color_index = this.get_color_queue().length - 1; current_color_index > 0; current_color_index--)
    {
      swap_color_index = Math.floor(Math.random() * (current_color_index + 1));
      place_holder = this.get_color_queue()[current_color_index];
      this.get_color_queue()[current_color_index] = this.get_color_queue()[swap_color_index];
      this.get_color_queue()[swap_color_index] = place_holder;
    }
  }
}
