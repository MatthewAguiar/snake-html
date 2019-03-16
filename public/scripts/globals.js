////// Global Functions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The below functions will be available to any script in the program.
/**
* @function save
* @description The save method is called to store a key and an associated value in the browser's localStorage.
* @param key The key with which to save the value to in the localStorage.
* @param value The value being stored in the key.
*/
function save(key, value)
{
  localStorage.setItem(key, value);
}
/**
* @function load
* @description The load function will retrive the value associated with a particular key.
* @param key The key with which to load the value from.
* @return Return the value of a particular key.
*/
function load(key)
{
  return localStorage.getItem(key);
}

/**
* @function remove
* @description The remove function will remove any key / value pair from localStorage.
* @param key The key of the pair to be removed.
*/
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
//
const NEON_RGB = "rgb(148, 255, 0)"; //Because NEON is not a default HTML color this rgb function will be put in its place.
