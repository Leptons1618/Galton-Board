function wall(x, y, width, height) {
  return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
          fillStyle: '#868e96'
      }
  });
}

function peg(x, y) {
  return Matter.Bodies.circle(x, y, 14, {
      label: 'peg',
      isStatic: true,
      restitution: 0.5,
      render: {
          fillStyle: '#82c91e'
      }
  });
}

function bead() {
  return Matter.Bodies.circle(920, 40, 12, {
      restitution: 0.5,
      render: {
          fillStyle: '#e64980'
      }
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

// engine
let engine = Matter.Engine.create();

// render
let render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
      width: 1920,
      height: 1080,
      wireframes: false,
      background: '#f8f9fa'
  }
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

// divider walls
for (let x = 0; x <= 1910; x += 80) {
  let divider = wall(x, 710, 20, 660);
  Matter.World.add(engine.world, divider);
}

// pegs
let isStaggerRow = false;
for (let y = 80; y <= 380; y += 40) {
  let startX = isStaggerRow ? 80 : 40;
  for (let x = startX; x <= 1910; x+= 80) {
      Matter.World.add(engine.world, peg(x, y));
  }
  isStaggerRow = !isStaggerRow;
}

// events
Matter.Events.on(engine, 'collisionStart', lightPeg);

// beads
let dropBeadInterval = setInterval(dropBead, 350);