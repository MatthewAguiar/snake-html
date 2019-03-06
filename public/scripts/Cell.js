
class Cell
{
  constructor(x, y)
  {
    this.occupancy = CELL_STATUS.empty;
    this.x = x;
    this.y = y;
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
}
