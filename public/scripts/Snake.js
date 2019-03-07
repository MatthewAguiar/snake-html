
class Snake
{
  constructor()
  {
    this.head = this.tail = null;
    this.length = 0;
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

  add_node(node, order)
  {
    if(this.head == null && this.tail == null)
    {
      this.head = node;
      this.tail = this.head;
    }
    else if(order == 'a')
    {
      this.tail.set_next(node);
      node.set_previous(this.tail);
      this.tail = node;
    }
    else if(order == 'p')
    {
      this.head.set_previous(node);
      node.set_next(this.head);
      this.head = node;
    }
    this.length++;
  }
}
