/**
* Represents an Apple that will be placed onto the Grid.
* @class
*/
class Apple extends Indexable
{
  /**
  * @constructor
  * @description Calls the constructor of the Indexable superclass. This is because both SnakeNodes and Apples have the ability to be found at certain rows and columns within the Grid.
  */
  constructor(row, column)
  {
    super(row, column);
    this.color = "red";
  }
}
