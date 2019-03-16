/**
* A class that acts as a single SnakeNode in the Snake class' linked-list of SnakeNodes.
* @class
*/
class SnakeNode extends Indexable
{
  /**
  * @constructor
  * @description Sets the row and column in which the SnakeNode will be held in, in the Grid. Each SnakeNode also is invoked with pointers to the next node in the list and the direction the node is moving.
  * @param {Array.<string>} colors An array of strings which will be saved as a queue of colors to make added SnakeNodes.
  */
  constructor(row, column, init_direction)
  {
    super(row, column);
    this.direction = init_direction;
    this.next = null;
    this.previous = null;
  }

  /**
  * @method copy
  * @description Produces a deep copy of the SnakeNode that calls it.
  * @return {SnakeNode} Reutrn of deep copy of "this" SnakeNode.
  */
  copy()
  {
    var copy = new SnakeNode(this.get_row(), this.get_column(), this.get_direction()); //Create the brand new SnakeNode.
    //Set the copy's preoperties.
    copy.set_previous(this.get_previous());
    copy.set_next(this.get_next());
    copy.set_color(this.get_color());
    return copy; //Then return!
  }

  /**
  * @method copy_properties_from_node
  * @description Copies properties such as row, column and direction from another node that is passed into the method.
  * @param {SnakeNode} node The node to copy properties from.
  */
  copy_properties_from_node(node)
  {
    this.set_row(node.get_row());
    this.set_column(node.get_column());
    this.set_direction(node.get_direction());
  }

  /**
  * @method get_direction
  * @return {DIRECTION} Return direction of the SnakeNode.
  */
  get_direction()
  {
    return this.direction;
  }

  /**
  * @method set_direction
  * @param {DIRECTION} direction The direction the SnakeNode should be headed in.
  */
  set_direction(direction)
  {
    this.direction = direction
  }

  /**
  * @method has_next
  * @return {boolean} Return true if the SnakeNode has another node after it. Return false if not.
  */
  has_next()
  {
    if(this.next == null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  /**
  * @method has_previous
  * @return {boolean} Return true if the SnakeNode has a node before it. Return false if not.
  */
  has_previous()
  {
    if(this.previous == null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  /**
  * @method get_next
  * @return {SnakeNode|null} Return the next SnakeNode in the list.
  */
  get_next()
  {
    return this.next;
  }

  /**
  * @method set_next
  * @param {SnakeNode|null} node The node to make next to this SnakeNode.
  */
  set_next(node)
  {
    this.next = node;
  }

  /**
  * @method get_previous
  * @return {SnakeNode|null} Return the previous SnakeNode in the list.
  */
  get_previous()
  {
    return this.previous;
  }

  /**
  * @method set_previous
  * @param {SnakeNode|null} node The node to make previous to this SnakeNode.
  */
  set_previous(node)
  {
    this.previous = node;
  }
}
