var frames = 0;

function draw()
{
  console.log("loopin " + frames);
  frames++;  

  window.setTimeout(draw, 16);
}
