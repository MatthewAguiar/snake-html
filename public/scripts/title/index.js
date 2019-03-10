
function init_button_group($button_set)
{
  $button_set.on("click",
    function()
    {
      $button_set.css("background-color", "orange");
      $button_set.css("box-shadow", "0px 0px 15px orange");
      $(this).css("background-color", "rgb(48, 193, 29)");
      $(this).css("box-shadow", "0px 0px 15px rgb(48, 193, 29)");
    });
}

function init_color_buttons()
{
  for(let i = 0; i < number_of_colors; i++)
  {
    color_selected_array[i] = "";
  }
  save(COLOR_KEY, color_selected_array);
  $color_options.on("click",
    function()
    {
      let $selected_color = $(this);
      let index_of_color_in_array = $color_options.index($selected_color);
      if(color_selected_array[index_of_color_in_array] == "")
      {
        $selected_color.css("background-color", $selected_color.css("background-color"));
        $selected_color.css("box-shadow", $selected_color.css("box-shadow"));
        color_selected_array[index_of_color_in_array] = $selected_color.attr("id");
      }
      else
      {
        if($selected_color.attr("id") != "neon")
        {
          $selected_color.css("background-color", $selected_color.attr("id"));
          $selected_color.css("box-shadow", "0px 0px 15px " + $selected_color.attr("id"));
        }
        else
        {
          $selected_color.css("background-color", NEON_RGB);
          $selected_color.css("box-shadow", "0px 0px 15px " + NEON_RGB);
        }
        color_selected_array[index_of_color_in_array] = "";
      }
      save(COLOR_KEY, color_selected_array);
    });
}

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

function is_custom_background()
{
  let custom_background = false;
  if($web_background.val() != "")
  {
    custom_background = true;
  }
  return custom_background;
}

function init_play_button()
{
  $play_button.on("click",
    function()
    {
      let color_chosen = color_is_chosen();
      let custom_background = is_custom_background();
      if(!color_chosen)
      {
        color_selected_array[0] = "green";
        save(COLOR_KEY, color_selected_array);
      }
      if(custom_background)
      {
        save(CUSTOM_BACKGROUND_KEY, $web_background.val());
      }
      else
      {
        remove(CUSTOM_BACKGROUND_KEY);
      }
      document.location.href = "game-app.html";
    }
  );
}

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

//////////////////////////////////////////////////////////////////////////////////////////////
let $speed_options = $(".speed-option"); //const?
let $color_options = $(".color-option");
let number_of_colors = $color_options.length;
let color_selected_array = [];
let $background_options = $(".background-option");
let $web_background = $("#custom-background");
let $music_options = $(".music-option");
let $play_button = $("#start-button");
init_button_group($speed_options);
init_button_group($background_options);
init_button_group($music_options);
init_button_group($play_button);
init_color_buttons();
init_play_button();
///////////////////////////////////////////////////////////////////////////////////////////////.
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
