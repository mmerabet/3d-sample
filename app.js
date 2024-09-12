// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-model').appendChild(renderer.domElement);

// Set initial camera and model scale based on screen size
function adjustCameraAndModelForScreenSize() {
  const screenWidth = window.innerWidth;
  
  if (screenWidth < 768) {  // Mobile view
    camera.position.set(0, 2, 8);  // Adjust camera position for mobile
    model.scale.set(0.8, 0.8, 0.8);  // Smaller scale for mobile
  } else if (screenWidth >= 768 && screenWidth < 1024) {  // Tablet view
    camera.position.set(0, 3, 10);  // Adjust camera for tablet
    model.scale.set(1, 1, 1);  // Normal scale for tablet
  } else {  // Desktop view
    camera.position.set(0, 4, 12);  // Adjust camera for desktop
    model.scale.set(1.5, 1.5, 1.5);  // Larger scale for desktop
  }
}

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
