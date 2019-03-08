
class SnakeNode extends Indexable
{
  constructor(row, column, init_direction)
  {
    super(row, column);
    this.direction = init_direction;
    this.next = null;
    this.previous = null;
  }

//TODO: SOMETIMES NULL
  copy()
  {
    var copy = new SnakeNode(this.get_row(), this.get_column(), this.get_direction());
    copy.set_previous(this.get_previous());
    copy.set_next(this.get_next());
    return copy;
  }

  copy_properties_from_node(node)
  {
    this.set_row(node.get_row());
    this.set_column(node.get_column());
    this.set_direction(node.get_direction());
  }

  get_direction()
  {
    return this.direction;
  }

  set_direction(direction)
  {
    this.direction = direction
  }

  has_next()
  {
    if(this.next == null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  has_previous()
  {
    if(this.previous == null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  get_next()
  {
    return this.next;
  }

  set_next(node)
  {
    this.next = node;
  }

  get_previous()
  {
    return this.previous;
  }

  set_previous(node)
  {
    this.previous = node;
  }
}
