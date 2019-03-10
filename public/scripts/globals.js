
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

const SPEED_KEY = "speed";
const SLOW = 200;
const MEDIUM = 100;
const FAST = 50;
//
const COLOR_KEY = "color";
//
const BACKGROUND_KEY = "background";
const NO_BACKGROUND = "";
const CURRENT_BACKGROUND = "images/landing-page/title-background.jpg";
const SPIRAL = "images/game/spiral-background.gif";
const CUSTOM_BACKGROUND_KEY = "custom-background";
//
const MUSIC_KEY = "music";
const RELAXING = "audio/music/game/relax.mp3";
const MILD = "audio/music/game/mild.mp3";
const INTENSE = "audio/music/game/intense.mp3";
const NEON_RGB = "rgb(148, 255, 0)";
