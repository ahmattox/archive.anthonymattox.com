/*
*  Script by Anthony Mattox
*  Connects to Processing.js script to mak fullscreen PJS canvas
*    and plays sounds linked in the html page
*
*/


$(document).ready(init);

function init() {
}

// function called by Processing when script is initialized
var ProcessingInit = function() {
  function resizeWindow() {
    // get the PJS canvas
    var ballsCanvas = Processing.getInstanceById('balls');
    // call resize function of the Processing script
    ballsCanvas.resize($(window).width(),$(window).height());
  }
  
  // bind event to window resize function
  $(window).resize(resizeWindow);
  // also call it once when the script is initialized
  resizeWindow();
}


// function called by PJS script to play html audio tag
var playSound = function(bouceVol) {
  // get a random audio tag in #sounds
  var bounceSound = $('#sounds audio:eq('+Math.floor(Math.random()*$('#sounds audio').length)+')').get(0);
  // set volume, sent from processing
  bounceSound.volume = bouceVol;
  // play it
  bounceSound.play();
}