
class Cell
{
  constructor(x, y, size)
  {
    this.occupancy = CELL_STATUS.empty;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  get_occupancy()
  {
    return this.occupancy;
  }

  set_occupancy(status)
  {
    this.occupancy = status;
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
    if(this.get_occupancy() == CELL_STATUS.snake)
    {
      CANVAS_CONTEXT.beginPath();
      CANVAS_CONTEXT.rect(this.get_x(), this.get_y(), this.size, this.size);
      CANVAS_CONTEXT.fillStyle = "green";
      CANVAS_CONTEXT.fill();
      CANVAS_CONTEXT.closePath();
    }
    else if(this.get_occupancy() == CELL_STATUS.apple)
    {
      CANVAS_CONTEXT.beginPath();
      CANVAS_CONTEXT.rect(this.get_x(), this.get_y(), this.size, this.size);
      CANVAS_CONTEXT.fillStyle = "red";
      CANVAS_CONTEXT.fill();
      CANVAS_CONTEXT.closePath();
    }
  }
}
