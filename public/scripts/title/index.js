////// Main Menu Button Functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* @function init_orange_button_group
* @description This function is used to define the properties of all orange buttons in index.html as far as changing colors when clicked.
* @param {Array} $button_collection This is the collection of buttons to apply the "click" listener to.
*/
function init_orange_button_group($button_collection)
{
  $button_collection.on("click",
    function()
    {
      $button_collection.removeClass("green-button"); //
      $button_collection.addClass("orange-button");
      $(this).removeClass("orange-button");
      $(this).addClass("green-button");
    });
}

/**
* @function init_color_buttons
* @description Initializes the properties of all the color buttons on index.html.
*/
function init_color_buttons()
{
  for(let i = 0; i < number_of_colors; i++) //Initialize the array of colors that will keep track of what colors the user chooses.
  {
    color_selected_array[i] = "";
  }
  save(COLOR_KEY, color_selected_array); //Save the color data to the localStorage as an empty string. (Remember that localStorage can't save arrays. Just stringifies them!)
  $color_options.on("click",
    function()
    {
      let $selected_color = $(this);
      let index_of_color_in_array = $color_options.index($selected_color); // Get the index at which the currently selected jQuery object appears in the jQuery collection of color buttons.
      if(color_selected_array[index_of_color_in_array] == "") //This color index correlates to the indicies of the color_selected array so that color names may be added or removed from it.
      {
        $selected_color.css("background-color", $selected_color.css("background-color")); //If the button is clicked, keep its color the same as it currently is when its hovered over.
        $selected_color.css("box-shadow", $selected_color.css("box-shadow")); //Same with the glow.
        color_selected_array[index_of_color_in_array] = $selected_color.attr("id"); //Most importantly, save the color name of the button into the array.
      }
      else
      {
        if($selected_color.attr("id") != "neon") //Reset the color button if the color was clicked on but previously selected using the HTML tag's id..
        {
          $selected_color.css("background-color", $selected_color.attr("id"));
          $selected_color.css("box-shadow", "0px 0px 15px " + $selected_color.attr("id"));
        }
        else //If the HTML tag was a neon box, instead of the id, use the global NEON constant.
        {
          $selected_color.css("background-color", NEON_RGB);
          $selected_color.css("box-shadow", "0px 0px 15px " + NEON_RGB);
        }
        color_selected_array[index_of_color_in_array] = "";
      }
      save(COLOR_KEY, color_selected_array); //Resave the color array after all changes have been made.
    });
}

/**
* @function color_is_chosen
* @description Checks if a color has actually been chosen from the collection of buttons.
* @return {boolean} Return a boolean that indeicates if at least one color has been chosen from the array.
*/
function color_is_chosen()
{
  let color_chosen = false;
  for(let i = 0; i < color_selected_array.length; i++)
  {
    if(color_selected_array[i] != "")
    {
      color_chosen = true;
      break;
    }
  }
  return color_chosen;
}

/**
* @function is_custom_background
* @description Checks if their exists text in the "Photo Link" input box and returns true if their is.
* @return {boolean} Return a boolean, true if their is text in the "Photo Link" input or false if not.
*/
function is_custom_background()
{
  let custom_background = false;
  if($web_background.val() != "")
  {
    custom_background = true;
  }
  return custom_background;
}

/**
* @function init_play_button
* @description Initializes the functionality of the play button by attaching an event listener that finalizes the color and background data and goes to the game-app.html page.
*/
function init_play_button()
{
  $play_button.on("click",
    function()
    {
      let color_chosen = color_is_chosen();
      let custom_background = is_custom_background();
      if(!color_chosen)
      {
        color_selected_array[0] = "green"; //If no color has been chosen just use green as the default.
        save(COLOR_KEY, color_selected_array);
      }
      if(custom_background)
      {
        save(CUSTOM_BACKGROUND_KEY, $web_background.val()); //If the exists a custom background save it to the localStorage.
      }
      else
      {
        remove(CUSTOM_BACKGROUND_KEY); //Otherwise remove what ever might have previously been stored as a custom background.
      }
      document.location.href = "game-app.html"; //GO TO game-app.html.
    }
  );
}

/**
* @function set_speed
* @description Save the snakes speed to the localStorage.
*/
function set_speed()
{
  let $button_pressed = $(this);
  switch($button_pressed.attr("id"))
  {
    case "slow":
      save(SPEED_KEY, SLOW);
      break;

    case "medium":
      save(SPEED_KEY, MEDIUM);
      break;

    case "fast":
      save(SPEED_KEY, FAST);
  }
}

/**
* @function set_background
* @description Save the game's background to the data.
*/
function set_background()
{
  let $button_pressed = $(this);
  switch($button_pressed.attr("id"))
  {
    case "no-background-button":
      save(BACKGROUND_KEY, NO_BACKGROUND);
      break;

    case "spiral-background-button":
      save(BACKGROUND_KEY, SPIRAL);
  }
}

/**
* @function set_music
* @description Save the desired music path to the localStorage.
*/
function set_music()
{
  let $button_pressed = $(this);
  switch($button_pressed.attr("id"))
  {
    case "relaxing-button":
      save(MUSIC_KEY, RELAXING);
      break;

    case "mild-button":
      save(MUSIC_KEY, MILD);
      break;

    case "intense-button":
      save(MUSIC_KEY, INTENSE);
  }
}
////// Button Collections ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Most variables below are collections of HTML buttons that will be processed using the event handlers below and the functions above.
let $speed_options = $(".speed-option"); //const?
let $color_options = $(".color-option");
let number_of_colors = $color_options.length;
let color_selected_array = [];
let $background_options = $(".background-option");
let $web_background = $("#custom-background-input");
let $music_options = $(".music-option");
let $play_button = $("#play-button");
init_orange_button_group($speed_options);
init_orange_button_group($background_options);
init_orange_button_group($music_options);
init_orange_button_group($play_button);
init_color_buttons();
init_play_button();
////// Event Handlers ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
save(SPEED_KEY, SLOW);
$speed_options.on("click", set_speed);
save(BACKGROUND_KEY, CURRENT_BACKGROUND);
$background_options.on("click", set_background);
save(MUSIC_KEY, RELAXING);
$music_options.on("click", set_music);
if(load(CUSTOM_BACKGROUND_KEY) != null)
{
  $web_background.val(load(CUSTOM_BACKGROUND_KEY));
}
