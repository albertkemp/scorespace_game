let img;

// Load the image.
function preload() {
  img = loadImage('spaceship.png');
  console.log(img);
}

function setup() {
  createCanvas(100, 100);

  background(50);

  // Draw the image.
  image(img, 0, 0);

  describe('An image of the underside of a white umbrella with a gridded ceiling above.');
}