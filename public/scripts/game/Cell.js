/**
* Represents a Cell object that is placed in each row and column of the Grid. Each Cell can hold either an Apple, SnakeNode or could contain null.
* @class
*/
class Cell
{
  /**
  * @constructor
  * @description Takes an x and y coordinate on the canvas as well as the size of the cell on the screen and saves those pieces of data in instance variables.
  * @param {natural} x The x coordinate to place the cell on the canvas.
  * @param {natural} y The y coordinate to place the cell on the canvas.
  * @param {natural} size The size of the Cell on the canvas.
  */
  constructor(x, y, size)
  {
    this.occupant = null;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  /**
  * @method get_occupant
  * @return {Indexable|null} Returns the current occupant object, or null, that the Cell contains.
  */
  get_occupant()
  {
    return this.occupant;
  }

  /**
  * @method set_occupant
  * @param {Indexable|null} object The object to store as the Cell's occupant.
  */
  set_occupant(object)
  {
    this.occupant = object;
  }

  /**
  * @method get_occupancy_status
  * @return {CELL_STATUS} Returns the status of a Cell. Does the Cell contain a SnakeNode, Apple or is it empty.
  */
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

  /**
  * @method get_x
  * @return {natural} Returns the x coordinate of the Cell on the Canvas.
  */
  get_x()
  {
    return this.x;
  }

  /**
  * @method get_y
  * @return {natural} Returns the y coordinate of the Cell on the Canvas.
  */
  get_y()
  {
    return this.y;
  }

  /**
  * @method draw
  * @description Draws the Cell onto the canvas if it has a meaningful occupant. If the occupancy of this Cell is empty, then don't even draw it.
  */
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
