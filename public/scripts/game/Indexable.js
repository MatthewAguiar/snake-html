class Indexable
{
  constructor(row, column)
  {
    this.row = row;
    this.column = column;
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
}
