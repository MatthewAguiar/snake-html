
class Grid
{
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

  init_cells()
  {
    var canvas_width = parseInt(CANVAS.width); //parseInt(arg0) is used as saftey!
    var canvas_height = parseInt(CANVAS.height);
    var number_of_rows = canvas_height / this.get_cell_size();
    var number_of_columns = canvas_width / this.get_cell_size();
    console.log("Rows: " + number_of_rows, "Columns: " + number_of_columns);
    var x = 0;
    var y = 0;
    for(let i = 0; i < number_of_rows; i++)
    {
      this.cells[i] = []; //Set up a new row as an array with in an array.
      for(let j = 0; j < number_of_columns; j++)
      {
        this.cells[i][j] = new Cell(x, y, this.get_cell_size());
        x += this.get_cell_size();
      }
      x = 0;
      y += this.get_cell_size();
    }
  }

  get_cell_size()
  {
    return this.cell_size;
  }

  set_cell_size(size)
  {
    if(size >= MIN_CELL_SIZE && size <= MAX_CELL_SIZE)
    {
      this.cell_size = size;
    }
  }

  get_cells()
  {
    return this.cells;
  }

  get_cell(row, column)
  {
    return this.cells[row][column];
  }

  get_cell_occupancy(row, column)
  {
    return this.cells[row][column].get_occupancy();
  }

  set_cell_occupancy(row, column, status)
  {
    this.cells[row][column].set_occupancy(status);
  }

  get_number_of_rows()
  {
    return this.get_cells().length;
  }

  get_number_columns_in_row(row)
  {
    return this.get_cells()[row].length;
  }

  filter_cells(occupancy)
  {
    var random_coordinates = [];
    for(let i = 0; i < this.get_cells().length; i++)
    {
      for(let j = 0; j < this.get_cells()[i].length; j++)
      {
        if(this.get_cell_occupancy(i, j) == occupancy)
        {
          random_coordinates.push([i, j]);
        }
      }
    }
    return random_coordinates;
  }
}
