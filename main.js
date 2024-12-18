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

  // Start the renderer
  Matter.Render.run(render);

  // Create runner
  console.log("Creating runner");
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  // Update the wall function
  function wall(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: '#868e96',
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
  for (let x = 0; x <= canvasWidth; x += 30) {
    const divider = wall(x, (canvasHeight / 4) * 3, 8, canvasHeight / 2);
    Matter.World.add(engine.world, divider);
  }

  // Update the bead function
  function bead() {
    return Matter.Bodies.circle(canvasWidth / 2, 40, 8, {
      restitution: 0.5,
      render: {
        fillStyle: '#e64980',
      },
    });
  }

  // Update the peg function
  function peg(x, y) {
    return Matter.Bodies.circle(x, y, 14, {
      label: 'peg',
      isStatic: true,
      restitution: 0.5,
      render: {
        fillStyle: '#82c91e',
      },
    });
  }

  // Add the randomColor function
  function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Update peg positions with random colors
  let pegs = [];
  for (let y = 120; y <= (canvasHeight / 4) * 3; y += 80) {
    for (let x = 60; x <= canvasWidth - 60; x += 120) {
      const p = peg(x, y);
      p.render.fillStyle = randomColor(); // Assign random colors to pegs
      pegs.push(p);
    }
  }
  pegs.forEach((p) => Matter.World.add(engine.world, p));

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

  // Define the rand function
  function rand(min, max) {
    return Math.random() * (max - min) + min;
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

  // Start dropping beads at intervals
  setInterval(dropBead, 350);

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

