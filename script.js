function wall(x, y, width, height) {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: {
      fillStyle: '#2c3e50', // Darker wall color
      strokeStyle: '#34495e', // Outline color
      lineWidth: 2,
    },
  });
}

function peg(x, y) {
  return Matter.Bodies.circle(x, y, 14, {
    label: 'peg',
    isStatic: true,
    restitution: 0.5,
    render: {
      fillStyle: '#9b59b6', // Vibrant peg color
      strokeStyle: '#8e44ad', // Outline color
      lineWidth: 2,
      shadowBlur: 10,
      shadowColor: '#8e44ad', // Shadow effect
    },
  });
}

function bead() {
  return Matter.Bodies.circle(window.innerWidth / 2, 40, 8, {
    restitution: 0.5,
    render: {
      fillStyle: '#e74c3c', // Bead color
      strokeStyle: '#c0392b', // Outline color
      lineWidth: 2,
      shadowBlur: 15,
      shadowColor: '#c0392b', // Shadow effect
    },
  });
}

function dropBead() {
  let droppedBead = bead();

  // add some "real world" randomness
  Matter.Body.setVelocity(droppedBead, {
      x: rand(-0.05, 0.05),
      y: 0
  });
  Matter.Body.setAngularVelocity(droppedBead, rand(-0.05, 0.05));

  Matter.World.add(engine.world, droppedBead);
}

// This function is called when a collision starts between two bodies, and it will light up the pegs
function lightPeg(event) {
  event.pairs
      .filter((pair) => pair.bodyA.label === 'peg')
      .forEach((pair) => {
          pair.bodyA.render.fillStyle = '#4c6ef5';
      });
}

// matter.js has a built in random range function, but it is deterministic
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create a random color
function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// engine
let engine = Matter.Engine.create();

// render
let render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // Render with colors and styles
    background: '#1e1e1e', // Dark background for contrast
    pixelRatio: 'auto', // Adjust pixel ratio for high-resolution displays
  },
});
Matter.Render.run(render);

// runner
let runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// boundary walls
Matter.World.add(engine.world, [
  wall(280, 5, 3280, 20),   // top
  wall(280, 1070, 3280, 20), // bottom
  wall(0, 330, 30, 1460),   // left
  wall(1910, 400, 20, 1460), // right
]);


let pegs = [];

// Add more pegs in a grid pattern
for (let y = 120; y <= 720; y += 80) {
  for (let x = 60; x <= 1860; x += 120) {
    const p = peg(x, y);
    p.render.fillStyle = randomColor(); // Random peg colors
    pegs.push(p);
  }
}

// divider walls
for (let x = 0; x <= 1910; x += 30) {
  let divider = wall(x, 810, 8, 560);
  Matter.World.add(engine.world, divider);
}

// pegs
let isStaggerRow = false;
for (let y = 280; y <= 480; y += 40) {
  let startX = isStaggerRow ? 80:40;
  for (let x = startX; x <= 1910; x+= 80) {
      Matter.World.add(engine.world, peg(x, y));
  }
  isStaggerRow = !isStaggerRow;
}

// events
Matter.Events.on(engine, 'collisionStart', lightPeg);

// beads
let dropBeadInterval = setInterval(dropBead, 350);