
class Grid
{
  constructor(cell_size)
  {
    this.cell_size = parseInt(cell_size);

    this.max_cell_size = 64;
    this.min_cell_size = 16;
    this.cells = [];

    //Setup Cells
    var canvas_width = parseInt(CANVAS.clientWidth);
    var canvas_height = parseInt(CANVAS.clientHeight);
    //console.log(canvas_width, canvas_height);
    //this.test_adjust_canvas(this.min_cell_size, this.max_cell_size, this.min_cell_size, 2048);
    canvas_width = this.adjust_canvas(canvas_width);
    canvas_height = this.adjust_canvas(canvas_height);
    //console.log(canvas_width, canvas_height);

  }

  adjust_canvas(size)
  {
    var size_remainder = size % this.cell_size;
    while(size_remainder != 0)
    {
      size++;
      size_remainder = size % this.cell_size;
    }
    return size;
  }

  get_cell_size()
  {
    return this.cell_size;
  }

  set_cell_size(size)
  {
    if(size >= this.min_cell_size && size <= this.max_cell_size)
    {
      this.cell_size = size;
    }
  }

  test_adjust_canvas(min_cell_size, max_cell_size, min_canvas_size, max_canvas_size)
  {
    var original_cell_size = this.cell_size;
    for(let i = min_cell_size; i <= max_cell_size; i++)
    {
      for(let j = min_canvas_size; j <= max_canvas_size; j++)
      {
        this.set_cell_size(i);
        console.log("CELL SIZE: " + this.get_cell_size() + " | CANVAS SIZE: " + this.adjust_canvas(j).toString());
      }
      console.log("");
    }
    this.set_cell_size(original_cell_size);
  }
}
