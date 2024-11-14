import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');

const sizes = {
    width: 800,
    height: 600
};


const scene = new THREE.Scene();

// House: Base (Walls)
const houseGeometry = new THREE.BoxGeometry(4, 4, 4); // Width, Height, Depth
const houseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown color for the walls
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.y = 1;
house.position.z = 10;
scene.add(house);

const houseMaterial1 = new THREE.MeshLambertMaterial({ color: '#01ff0f' }); // Brown color for the walls
const house1 = new THREE.Mesh(houseGeometry, houseMaterial1);
house1.position.y = 1; 
house1.position.x = 5;
scene.add(house1);

const houseMaterial2 = new THREE.MeshLambertMaterial({ color: '#ff1100' }); // Brown color for the walls
const house2 = new THREE.Mesh(houseGeometry, houseMaterial2);
house2.position.y = 1; 
house2.position.x = -5;
scene.add(house2);

const houseMaterial3 = new THREE.MeshLambertMaterial({ color: '#ff1100' }); // Brown color for the walls
const house3 = new THREE.Mesh(houseGeometry, houseMaterial3);
house3.position.y = 1; 
house3.position.z = -10;
scene.add(house3);

// Roof: Sloped Roof using a ConeGeometry
const roofGeometry = new THREE.ConeGeometry(3, 2, 4); // Radius, Height, Segments
const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Darker brown for the roof
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.rotation.y = Math.PI / 4; // Rotate to align with the walls
roof.position.y = 2.9; // Position it above the house
house.add(roof);

const roofMaterial1 = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Darker brown for the roof
const roof1 = new THREE.Mesh(roofGeometry, roofMaterial1);
roof1.rotation.y = Math.PI / 4; // Rotate to align with the walls
roof1.position.y = 2.9; // Position it above the house
house1.add(roof1);

const roofMaterial2 = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Darker brown for the roof
const roof2 = new THREE.Mesh(roofGeometry, roofMaterial2);
roof2.rotation.y = Math.PI / 4; // Rotate to align with the walls
roof2.position.y = 2.9; // Position it above the house
house2.add(roof2);

const roofMaterial3 = new THREE.MeshLambertMaterial({ color: 0xD2691E }); // Darker brown for the roof
const roof3 = new THREE.Mesh(roofGeometry, roofMaterial3);
roof3.rotation.y = Math.PI / 4; // Rotate to align with the walls
roof3.position.y = 2.9; // Position it above the house
house3.add(roof3);

// Door: Simple Rectangle
const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1); // Width, Height, Depth
const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark brown for the door
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, -1, 2.01); // Position the door at the front
house.add(door);

const doorGeometry1 = new THREE.BoxGeometry(0.1, 2, 1); // Width, Height, Depth
const doorMaterial1 = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark brown for the door
const door1 = new THREE.Mesh(doorGeometry1, doorMaterial1);
door1.position.set(2, -1, 0); // Position the door at the front
house1.add(door1);

const doorGeometry2 = new THREE.BoxGeometry(0.1, 2, 1); // Width, Height, Depth
const doorMaterial2 = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark brown for the door
const door2 = new THREE.Mesh(doorGeometry2, doorMaterial2);
door2.position.set(-2, -1, 0); // Position the door at the front
house2.add(door2);

const doorGeometry3 = new THREE.BoxGeometry(1, 2, 0.1); // Width, Height, Depth
const doorMaterial3 = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark brown for the door
const door3 = new THREE.Mesh(doorGeometry3, doorMaterial3);
door3.position.set(0, -1, -2); // Position the door at the front
house3.add(door3);

// Windows: 2 Windows on the front side
const windowGeometry = new THREE.BoxGeometry(1, 1, 0.1);
const windowMaterial = new THREE.MeshLambertMaterial({ color: 0xADD8E6 }); // Light blue for the windows

// Window 1
const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
window1.position.set(-1.3, 0.3, 2.01); // Position it on the left side
house.add(window1);

const windowGeometry11  = new THREE.BoxGeometry(0.1, 1, 1);
const window11 = new THREE.Mesh(windowGeometry11, windowMaterial);
window11.position.set(2, 0.3, 1.3); // Position it on the left side
house1.add(window11);

const window12 = new THREE.Mesh(windowGeometry11, windowMaterial);
window12.position.set(-2, 0.3, 1.3); // Position it on the left side
house2.add(window12);

const window13 = new THREE.Mesh(windowGeometry, windowMaterial);
window13.position.set(-1.3, 0.3, -2); // Position it on the left side
house3.add(window13);

// Window 2
const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
window2.position.set(1.3, 0.3, 2.01); // Position it on the right side
house.add(window2);

const window21 = new THREE.Mesh(windowGeometry11, windowMaterial);
window21.position.set(2, 0.3, -1.3); // Position it on the left side
house1.add(window21);

const window22 = new THREE.Mesh(windowGeometry11, windowMaterial);
window22.position.set(-2, 0.3, -1.3); // Position it on the left side
house2.add(window22);

const window23 = new THREE.Mesh(windowGeometry, windowMaterial);
window23.position.set(1.3, 0.3, -2); // Position it on the right side
house3.add(window23);

// Ground: Simple Plane for the ground
const groundGeometry = new THREE.PlaneGeometry(100, 100, 200);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Green for the ground
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2; // Rotate the ground to be horizontal
ground.position.y = -1; // Place the ground below the house
scene.add(ground);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(10, 6, 10); // Position the camera
camera.lookAt(0, 1, 0); // Make the camera look at the house
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true; // Enable shadow maps
// Set shadow map size (higher values = better resolution but more performance-intensive)
renderer.shadowMap.size = 2048;  // Or 1024, depending on your performance needs


// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ambient light to brighten up the scene
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(5, 5, 5); // Position the light above
directionalLight.castShadow = true; // Enable shadow casting by the light
directionalLight.shadow.mapSize.width = 2048;  // Set higher map size
directionalLight.shadow.mapSize.height = 2048;

directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

scene.add(directionalLight);



// Enable shadows for the house
house.castShadow = true;
house1.castShadow = true;
house2.castShadow = true;
house3.castShadow = true;
ground.receiveShadow = true;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Enable damping for smooth control
controls.dampingFactor = 0.25; // Optional: Adjust damping factor (default is 0.25)
controls.enableZoom = true; // Allow zooming
controls.maxDistance = 50; // Optional: Set the maximum zoom distance
controls.minDistance = 5;  // Optional: Set the minimum zoom distance

// Animation loop
const tick = () => {

    // Update controls for damping
    controls.update();

    // Render the scene
    renderer.render(scene, camera);

    // Request the next frame
    requestAnimationFrame(tick);
};

// Start the animation loop
tick();
