// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set camera position further away to avoid too much zoom
camera.position.set(0, 4, 16);  // Move the camera further back to reduce the zoom

// Enable antialiasing and set pixel ratio for higher resolution
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  // Ensure high-res rendering on high DPI screens
document.getElementById('3d-model').appendChild(renderer.domElement);

// Set the background color of the 3D scene to light gray
renderer.setClearColor(0xE5E7EB);  // Tailwind's bg-gray-200 color

// Global variables to store the model and interaction state
let model;
let userIsInteracting = false;  // Track if the user is interacting

// Load the 3D model
const loader = new THREE.GLTFLoader();
loader.load('scene.gltf', function (gltf) {
  model = gltf.scene;
  scene.add(model);

  // Adjust model material properties for better lighting
  model.traverse(function (child) {
    if (child.isMesh) {
      child.material.metalness = 0.1;
      child.material.roughness = 0.4;
      child.material.envMapIntensity = 2;
    }
  });

  // Set up lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);  // Brighter ambient light
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);  // Stronger directional light
  directionalLight1.position.set(5, 10, 5).normalize();
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);  // Secondary light
  directionalLight2.position.set(-5, 5, 5).normalize();
  scene.add(directionalLight2);

  // Add OrbitControls to allow the user to rotate the model manually on any axis
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;  // Smooth rotation
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;  // Enable zoom

  // Set maximum and minimum distances for zooming
  controls.maxDistance = 25;  // Limit how far the user can zoom out
  controls.minDistance = 5;   // Limit how close the user can zoom in

  // Detect when the user starts interacting
  controls.addEventListener('start', function () {
    userIsInteracting = true;  // Stop automatic rotation when the user starts interacting
  });

  // Detect when the user stops interacting
  controls.addEventListener('end', function () {
    userIsInteracting = false;  // Resume automatic rotation when the user stops interacting
  });

  // Variables to control automatic rotation
  let rotationSpeed = 0.005;

  // Animation function
  function animate() {
    requestAnimationFrame(animate);

    // Automatic rotation when the user is not interacting
    if (!userIsInteracting) {
      model.rotation.y += rotationSpeed;  // Continue automatic Y-axis rotation
    }

    controls.update();  // Update OrbitControls
    renderer.render(scene, camera);
  }

  // Start animation loop
  animate();

}, undefined, function (error) {
  console.error('Error loading the 3D model:', error);
});

// Handle window resize
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
