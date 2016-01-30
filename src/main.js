"use strict";

var frames = 0;
var game = new GameManager();

function draw()
{
  game.update();

  window.setTimeout(draw, 16);
}

draw();
