
class Grid
{
  constructor(cell_size)
  {
    this.cell_size = cell_size;
    this.max_cell_size = 64; //TODO: NO NEED FOR THIS??
    this.min_cell_size = 16;
    this.cells = [];

    //Instantiate Cells.
    var number_of_rows = parseInt(CANVAS.style.width) / this.cell_size;
    var number_of_columns = parseInt(CANVAS.style.height) / this.cell_size;
    console.log("Rows: " + number_of_rows, "Columns: " + number_of_columns);
    for(let i = 0; i < number_of_rows; i++)
    {
      let row_coordinate = number_of_rows / i;
      this.cells[i] = [];
      for(let j = 0; j < number_of_columns; j++)
      {
        let column_coordinate = number_of_columns / j;
        this.cells[i][j] = new Cell(row_coordinate + this.cell_size / 2, column_coordinate + this.cell_size / 2);
      }
    }
  }

  get_cell_size()
  {
    return this.cell_size;
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

  set_cell_size(size)
  {
    if(size >= this.min_cell_size && size <= this.max_cell_size)
    {
      this.cell_size = size;
    }
  }
}
