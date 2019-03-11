////// Global Functions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The below functions will be available to any script in the program.
function save(key, value)
{
  localStorage.setItem(key, value);
}

function load(key)
{
  return localStorage.getItem(key);
}

function remove(key)
{
  localStorage.removeItem(key);
}
////// Speed Constants ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const SPEED_KEY = "speed"; //The key with which to save the speed data to in the browser's localStorage.
const SLOW = 400;
const MEDIUM = 200;
const FAST = 100;
////// Color Key /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const COLOR_KEY = "color"; //The key with which to save the color array to in the browser's localStorage.
////// Background Constants //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const BACKGROUND_KEY = "background"; //The key with which to save the background link to in the browser's localStorage.
const NO_BACKGROUND = "";
const CURRENT_BACKGROUND = "images/landing-page/title-background.jpg";
const SPIRAL = "images/game/spiral-background.gif";
const CUSTOM_BACKGROUND_KEY = "custom-background"; //Will be used to override any other background chosen.
////// In-Game Music /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const MUSIC_KEY = "music"; //The key with which to save the music link to in the browser's localStorage.
const RELAXING = "audio/music/game/relax.mp3";
const MILD = "audio/music/game/mild.mp3";
const INTENSE = "audio/music/game/intense.mp3";
const NEON_RGB = "rgb(148, 255, 0)";
