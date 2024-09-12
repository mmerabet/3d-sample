// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Enable antialiasing and set pixel ratio for higher resolution
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  // Ensure high-res rendering on high DPI screens
document.getElementById('3d-model').appendChild(renderer.domElement);

// Set the background color of the 3D scene to light gray
renderer.setClearColor(0xE5E7EB);  // Tailwind's bg-gray-200 color

// Global variable to store the model
let model;

// Adjust camera and model scale based on screen size
function adjustCameraAndModelForScreenSize() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {  // Mobile view
    camera.position.set(0, 2, 8);  // Adjust camera position for mobile
    if (model) {
      model.position.set(0, 0.5, 0);  // Move model slightly upward for mobile
      model.scale.set(1.2, 1.2, 1.2);  // Larger scale for mobile to reduce pixelization
    }
  } else if (screenWidth >= 768 && screenWidth < 1024) {  // Tablet view
    camera.position.set(0, 3, 10);  // Adjust camera for tablet
    if (model) {
      model.position.set(0, 0.5, 0);  // Adjust model position
      model.scale.set(1.5, 1.5, 1.5);  // Adjust scale for tablet
    }
  } else {  // Desktop view
    camera.position.set(0, 4, 12);  // Adjust camera for desktop
    if (model) {
      model.position.set(0, 0.5, 0);  // Adjust model position for desktop
      model.scale.set(2, 2, 2);  // Larger scale for desktop to improve visibility
    }
  }
}

// Load the 3D model
const loader = new THREE.GLTFLoader();
loader.load('scene.gltf', function (gltf) {
  model = gltf.scene;
  scene.add(model);

  // Adjust model material properties for better lighting
  model.traverse(function (child) {
    if (child.isMesh) {
      child.material.metalness = 0.1;   // Reduce metalness to make it less dark
      child.material.roughness = 0.4;   // Adjust roughness to make it shinier
      child.material.envMapIntensity = 2; // Increase environment intensity
    }
  });

  // Set up lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);  // Brighter ambient light
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);  // Stronger directional light
  directionalLight1.position.set(5, 10, 5).normalize();
  scene.add(directionalLight1);

  // Add a second directional light for better illumination
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);  // Secondary light for fill
  directionalLight2.position.set(-5, 5, 5).normalize();
  scene.add(directionalLight2);

  // Variables to control zoom and rotation
  let zooming = true;
  let rotationSpeed = 0.025;  // Initial rotation speed

  // Animation function
  function animate() {
    requestAnimationFrame(animate);

    // Apply zoom and rotation effect at the start
    if (zooming) {
      camera.position.z -= 0.1;  // Zoom in
      model.rotation.y += rotationSpeed;  // Rotate model

      if (camera.position.z <= 5) {  // Stop zooming when close enough
        zooming = false;
        rotationSpeed = 0.005;  // Slower rotation after zoom
      }
    } else {
      model.rotation.y += rotationSpeed;  // Continue slow rotation
    }

    renderer.render(scene, camera);
  }

  // Start animation loop
  animate();

  // Adjust camera and model size based on the initial screen size
  adjustCameraAndModelForScreenSize();

}, undefined, function (error) {
  console.error('Error loading the 3D model:', error);
});

// Handle window resize
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  adjustCameraAndModelForScreenSize();  // Adjust camera and model on resize
});
