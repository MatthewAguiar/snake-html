/**
* @function parse_colors
* @description Takes in a raw string as input from localStorage and parses an array out of it for the Game object to use.
* @param {string} raw_string The string representing all the user selected colors from the landing page.
* @return {Array.<string>} Return an array of strings representing all of the Snake colors.
*/
function parse_colors(raw_string)
{
  /**
  * @function parse_colors_local
  * @description This is a local function that will start with an empty array and push color strings into it recursively.
  * @param {Array.<string>} color_array An array of strings representing colors.
  * @param {string} raw_string The string representing all the user selected colors from the landing page.
  * @return {Array.<string>} Return an array of strings representing all of the Snake colors.
  */
  function parse_colors_local(color_array, raw_string)
  {
    let index_of_comma = raw_string.indexOf(',');
    if(index_of_comma != -1)
    {
      let substring = raw_string.substring(0, index_of_comma);
      if(substring != "")
      {
        color_array.push(substring); //If there is indeed text between two commas, we've found a word! Push it into the color_array.
      }
      return parse_colors_local(color_array, raw_string.substring(index_of_comma + 1)); //Recall the local function moving the "comma cursor" up.
    }
    else //If there are no more commas that mean there may be only one or no words left...
    {
      if(raw_string != "")
      {
        color_array.push(raw_string); //If there is one final word, push it and then return.
      }
      return color_array;
    }
  }
  return parse_colors_local([], raw_string) //Call the "trampoline" function!
}

//MAIN GAME OBJECT!
let background = load(CUSTOM_BACKGROUND_KEY);
if(background == null)
{
  background = load(BACKGROUND_KEY);
}
const GAMEAPP = new Game(3, 32, load(SPEED_KEY), parse_colors(load(COLOR_KEY)), background, load(MUSIC_KEY));
