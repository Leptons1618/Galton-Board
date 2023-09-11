function setupGaltonBoard() {
  console.log("Setup function called");
  // Calculate canvas dimensions based on the viewport size
  const canvasWidth = window.innerWidth - 40; // Adjust for margin
  const canvasHeight = window.innerHeight - 40; // Adjust for margin

  // Create engine
  console.log("Creating engine");
  const engine = Matter.Engine.create();

  // Create render
  console.log("Creating render");
  const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: canvasWidth,
      height: canvasHeight,
      wireframes: true,
      background: '#f8f9fa',
    },
  });

  // Create runner
  console.log("Creating runner");
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  function wall(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: '#4c6ef5',
      },
    });
  }

  // Create boundary walls
  console.log("Creating boundary walls");
  Matter.World.add(engine.world, [
    wall(canvasWidth / 2, 0, canvasWidth, 20), // top
    wall(canvasWidth / 2, canvasHeight, canvasWidth, 20), // bottom
    wall(0, canvasHeight / 2, 20, canvasHeight), // left
    wall(canvasWidth, canvasHeight / 2, 20, canvasHeight), // right
  ]);

  // Create divider walls
  console.log("Creating divider walls");
  for (let x = 0; x <= canvasWidth; x += canvasWidth / 7) {
    const divider = wall(x, (canvasHeight / 4) * 3, 20, canvasHeight / 2);
    Matter.World.add(engine.world, divider);
  }

  // Function to create a bead
  console.log("Creating bead");
  function bead() {
    return Matter.Bodies.circle(canvasWidth / 2, 0, 10, {
      label: 'bead',
      render: {
        fillStyle: '#4c6ef5',
      },
    });
  }

  // Function to create a peg
  console.log("Creating pegs");
  function peg(x, y) {
    return Matter.Bodies.circle(x, y, 10, {
      isStatic: true,
      label: 'peg',
      render: {
        fillStyle: '#f8f9fa',
      },
    });
  }

  let isStaggerRow = false;
  for (let y = canvasHeight / 8; y <= (canvasHeight / 4) * 3; y += canvasHeight / 16) {
    let startX = isStaggerRow ? canvasWidth / 14 : canvasWidth / 7;
    for (let x = startX; x <= (canvasWidth / 7) * 6; x += canvasWidth / 7) {
      Matter.World.add(engine.world, peg(x, y));
    }
    isStaggerRow = !isStaggerRow;
  }

  // Function to drop a bead
  console.log("Creating dropBead function");
  function dropBead() {
    const droppedBead = bead();

    // Add some "real-world" randomness
    Matter.Body.setVelocity(droppedBead, {
      x: rand(-0.05, 0.05),
      y: 0,
    });
    Matter.Body.setAngularVelocity(droppedBead, rand(-0.05, 0.05));

    Matter.World.add(engine.world, droppedBead);
  }

  // Event to light up pegs on collision
  console.log("Creating lightPeg function");
  function lightPeg(event) {
    event.pairs
      .filter((pair) => pair.bodyA.label === 'peg')
      .forEach((pair) => {
        pair.bodyA.render.fillStyle = '#4c6ef5';
      });
  }

  // Add collision event listener
  console.log("Adding collision event listener");
  Matter.Events.on(engine, 'collisionStart', lightPeg);

  // Adjust canvas size on window resize
window.addEventListener('resize', () => {
  const canvas = render.canvas; // Get the canvas element from the Matter.Render object
  canvas.width = window.innerWidth - 40;
  canvas.height = window.innerHeight - 40;
});
}

// Initialize the Galton Board when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupGaltonBoard);
// window.onload = setupGaltonBoard;

  