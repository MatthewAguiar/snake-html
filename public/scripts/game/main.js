
function parse_colors(raw_string)
{
  function parse_colors_local(color_array, raw_string)
  {
    let index_of_comma = raw_string.indexOf(',');
    if(index_of_comma != -1)
    {
      let substring = raw_string.substring(0, index_of_comma);
      if(substring != "")
      {
        color_array.push(substring);
      }
      return parse_colors_local(color_array, raw_string.substring(index_of_comma + 1));
    }
    else
    {
      if(raw_string != "")
      {
        color_array.push(raw_string);
      }
      return color_array;
    }
  }
  return parse_colors_local([], raw_string)
}

let background = load(CUSTOM_BACKGROUND_KEY);
if(background == null)
{
  background = load(BACKGROUND_KEY);
}
const GAME_APP = new Game(3, 32, load(SPEED_KEY), parse_colors(load(COLOR_KEY)), background, load(MUSIC_KEY));
