
class Cell
{
  constructor(x, y, size)
  {
    this.occupant = null;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  get_occupant()
  {
    return this.occupant;
  }

  set_occupant(object)
  {
    this.occupant = object;
  }

  get_occupancy_status()
  {
    let status = CELL_STATUS.empty;
    if(this.get_occupant() instanceof SnakeNode)
    {
      status = CELL_STATUS.snake;
    }
    else if(this.get_occupant() instanceof Apple)
    {
      status = CELL_STATUS.apple;
    }

    return status;
  }

  get_x()
  {
    return this.x;
  }

  get_y()
  {
    return this.y;
  }

  draw()
  {
    if(this.get_occupancy_status() != CELL_STATUS.empty)
    {
      let color = this.get_occupant().get_color();
      if(color == "neon")
      {
        color = NEON_RGB;
      }
      CANVAS_CONTEXT.beginPath();
      CANVAS_CONTEXT.rect(this.get_x(), this.get_y(), this.size, this.size);
      CANVAS_CONTEXT.fillStyle = color;
      CANVAS_CONTEXT.fill();
      CANVAS_CONTEXT.closePath();
    }
  }
}
