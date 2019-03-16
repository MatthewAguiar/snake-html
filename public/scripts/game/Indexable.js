/**
* A class that allows objects such as SnakeNodes and Apples to be indexed in the Grid's array of Cells.
* @class
*/
class Indexable
{
  /**
  * @constructor
  * @description Given a row and column of the Grid, Indexable objects will contain the following instance variables below to keep track of where they are in the grid.
  * @param {natural} row A row in the grid.
  * @param {natural} column A column in the grid.
  */
  constructor(row, column)
  {
    this.row = row;
    this.column = column;
    this.color = "";
  }

  /**
  * @method get_row
  * @return {natural} Return the row that the Indexable object is in.
  */
  get_row()
  {
    return this.row;
  }

  /**
  * @method set_row
  * @param {natural} row The row to move the Indexable object to.
  */
  set_row(row)
  {
    this.row = row;
  }

  /**
  * @method get_column
  * @return {natural} Return the column that the Indexable object is in.
  */
  get_column()
  {
    return this.column;
  }

  /**
  * @method set_column
  * @param {natural} column The column to move the Indexable object to.
  */
  set_column(column)
  {
    this.column = column;
  }

  /**
  * @method get_color
  * @return {string} Return a string representing the color of an Indexable object.
  */
  get_color()
  {
    return this.color;
  }

  /**
  * @method set_color
  * @param {string} color The desired color to make the Indexable object.
  */
  set_color(color)
  {
    this.color = color;
  }
}
