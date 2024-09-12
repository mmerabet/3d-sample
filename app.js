// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-model').appendChild(renderer.domElement);

// Set up initial camera position
camera.position.z = 10;

// Load the 3D model
const loader = new THREE.GLTFLoader();
loader.load('scene.gltf', function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  // Adjust model properties
  model.traverse(function (child) {
    if (child.isMesh) {
      child.material.metalness = 0;
      child.material.roughness = 0.5;
    }
  });

  // Set up lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  // Variables to control zoom and rotation
  let zooming = true;
  let rotationSpeed = 0.025;  // Halved the initial rotation speed

  // Animation function
  function animate() {
    requestAnimationFrame(animate);

    // Apply zoom and rotation effect at the start
    if (zooming) {
      camera.position.z -= 0.1;  // Zoom in
      model.rotation.y += rotationSpeed;  // Rotate model

      if (camera.position.z <= 5) {  // Stop zooming when close enough
        zooming = false;
        rotationSpeed = 0.005;  // Halved the slow rotation speed
      }
    } else {
      model.rotation.y += rotationSpeed;  // Continue slow rotation
    }

    renderer.render(scene, camera);
  }

  animate();  // Start animation loop
}, undefined, function (error) {
  console.error('Error loading the 3D model:', error);
});

// Handle window resize
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
