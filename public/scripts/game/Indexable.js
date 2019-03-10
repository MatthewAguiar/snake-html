class Indexable
{
  constructor(row, column)
  {
    this.row = row;
    this.column = column;
    this.color = "";
  }

  get_row()
  {
    return this.row;
  }

  set_row(row)
  {
    this.row = row;
  }

  get_column()
  {
    return this.column;
  }

  set_column(column)
  {
    this.column = column;
  }

  get_color()
  {
    return this.color;
  }

  set_color(color)
  {
    this.color = color;
  }
}
