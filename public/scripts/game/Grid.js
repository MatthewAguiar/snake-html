/**
* A class used to contain Cells that hold Indexable objects. This helps when drawing the Cells on the screen and to manage what is where when the game is being processed each step.
* @class
*/
class Grid
{
  /**
  * @constructor
  * @description Sets up all variables such as an array of cells, and their sizes.
  * @param {natural} cell_size The size that all Cells in the grid will be.
  */
  constructor(cell_size)
  {
    ////// Initialize Instance Variables /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.cell_size = -1;
    this.cells = [];
    ////// Initialize Cell Size //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.set_cell_size(cell_size);
    ////// Instantiate Cells /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.init_cells();
  }
  /**
  * @method init_cells
  * @description Initializes all of the cells into the cells array with the proper x, y coordinates and size.
  */
  init_cells()
  {
    var canvas_width = parseInt(CANVAS.width); //parseInt() is used as saftey!
    var canvas_height = parseInt(CANVAS.height);
    var number_of_rows = canvas_height / this.get_cell_size(); //Get the number of rows and columns in the Grid. Will be used to calculate x, y coordinates below.
    var number_of_columns = canvas_width / this.get_cell_size();
    //console.log("Rows: " + number_of_rows, "Columns: " + number_of_columns);
    var x = 0; //Start x and y at 0, then PROPERLY increment.
    var y = 0;
    for(let i = 0; i < number_of_rows; i++)
    {
      this.cells[i] = []; //Set up a new row as an array with in an array.
      for(let j = 0; j < number_of_columns; j++)
      {
        this.cells[i][j] = new Cell(x, y, this.get_cell_size()); //At the specific row, column, invoke a new Cell and store it.
        x += this.get_cell_size(); //increment x by the size of the Cells in the grid to invoke the next Cell at the proper place.
      }
      x = 0; //Go back to the beginning of the canvas.
      y += this.get_cell_size(); //Go to the next column.
    }
  }

  /**
  * @method get_cell_size
  * @return {natural} Return the size of each Cell.
  */
  get_cell_size()
  {
    return this.cell_size;
  }

  /**
  * @method set_cell_size
  * @param {natural} size The size of the Cells.
  */
  set_cell_size(size)
  {
    if(size >= MIN_CELL_SIZE && size <= MAX_CELL_SIZE)
    {
      this.cell_size = size;
    }
  }

  /**
  * @method get_cells
  * @return {Array.<Cell>} Return the array of Cells.
  */
  get_cells()
  {
    return this.cells;
  }

  /**
  * @method get_cell
  * @param {natural} row A row in the Grid.
  * @param {natural} column A column in the Grid.
  * @return {Cell} Returns a particular Cell from the Grid.
  */
  get_cell(row, column)
  {
    return this.cells[row][column];
  }

  /**
  * @method get_cell_occupant
  * @param {natural} row A row in the Grid.
  * @param {natural} column A column in the Grid.
  * @return {Indexable|null} Return the occupant object or null that is held within a particular.
  */
  get_cell_occupant(row, column)
  {
    return this.cells[row][column].get_occupant();
  }

  /**
  * @method set_cell_occupant
  * @param {natural} row A row in the Grid.
  * @param {natural} column A column in the Grid.
  * @param {Indexable|null} object The object to store in the Cell located at (row, column) in the array.
  */
  set_cell_occupant(row, column, object)
  {
    this.cells[row][column].set_occupant(object);
  }

  /**
  * @method get_cell_occupancy_status
  * @param {natural} row A row in the Grid.
  * @param {natural} column A column in the Grid.
  * @return {CELL_STATUS} Return the occupancy status of a particular cell.
  */
  get_cell_occupancy_status(row, column)
  {
    return this.cells[row][column].get_occupancy_status();
  }

  /**
  * @method get_number_of_rows
  * @return {natural} Return the number of rows in the Grid.
  */
  get_number_of_rows()
  {
    return this.get_cells().length;
  }

  /**
  * @method get_cell_occupancy_status
  * @param {natural} row A row in the Grid.
  * @return {natural} Return the number of column in the specfied row.
  */
  get_number_columns_in_row(row)
  {
    return this.get_cells()[row].length;
  }

  /**
  * @method filter_cells Produces a 2D array of coordinates filtering only the coordinates that contain a Cell that is of the specified occupancy type.
  * @param {CELL_STATUS} occupancy The occupancy type to filter out.
  * @return {Array.<Array<natural>>} Return a 2D array that is either empty or containing sub-arrays of length 2. Index 0 = row coordinate, Index 1 = column coordinate
  */
  filter_cells(occupancy)
  {
    var coordinates = [];
    for(let i = 0; i < this.get_number_of_rows(); i++)
    {
      for(let j = 0; j < this.get_number_columns_in_row(i); j++)
      {
        if(this.get_cell_occupancy_status(i, j) == occupancy) //If the occupancy at the specific row and column is the occupancy state we want, push the information as an array of size 2 to the coordinate array.
        {
          coordinates.push([i, j]);
        }
      }
    }
    return coordinates; //Return the array of coordinate arrays.
  }
}
