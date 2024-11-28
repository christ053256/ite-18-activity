import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './Scene.css';
import Road from './objects/Road.jsx';
import Platform from './objects/platform.jsx';
import Un_truck from './objects/Un_truck.jsx';
import RoadSigned from './objects/RoadSigned.jsx';
import Car1 from './objects/Car1.jsx';


function Scene() {
  const sceneRef = useRef(null); // Ref to store the scene
  const sensitivity = 0.001; // Fixed sensit ivity value

  useEffect(() => {
    // Only create the scene once (if it hasn't been created yet)
    if (sceneRef.current) return; // If the scene has already been created, return

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = 0xffffff;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows
    renderer.logarithmicDepthBuffer = true;
    document.body.appendChild(renderer.domElement);

    // Store the scene, camera, and renderer in the ref
    sceneRef.current = { scene, camera, renderer };

    // Create light sources
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(15, 10, 10); // Position light above and to the side
    directionalLight.castShadow = true; // Enable shadow casting
    scene.add(directionalLight);

    // Adjust directional light's shadow properties
    directionalLight.shadow.mapSize.width = 1024; // Shadow map width
    directionalLight.shadow.mapSize.height = 1024; // Shadow map height
    directionalLight.shadow.camera.near = 0.1; // Near clipping plane for shadows
    directionalLight.shadow.camera.far = 50; // Far clipping plane for shadows
    directionalLight.shadow.camera.left = -50; // Left edge of the shadow camera
    directionalLight.shadow.camera.right = 50; // Right edge of the shadow camera
    directionalLight.shadow.camera.top = 50; // Top edge of the shadow camera
    directionalLight.shadow.camera.bottom = -50; // Bottom edge of the shadow camera
    //add some bias to prevent shadow acne
    directionalLight.shadow.bias = -0.005;

    
    const platform = Platform(500, 1, 5000);
    platform.receiveShadow = true; // Platform receives shadows
    platform.castShadow = true;
    scene.add(platform);

    async function road() {
      try {
        const road = await Road(10, 1.5, 6); // Wait for the road to load
        road.position.y = 0.5;
        road.rotation.y = Math.PI/2;
        road.castShadow = true; // Road casts shadow
        road.receiveShadow = true; // Road receives shadow
        platform.add(road); // Add the road to the platform/group
    
        // Call the animation loop
        animate();
      } catch (error) {
        console.alert('Error loading road:', error);
      }
    }

    async function car1() {
      try {
        const car = await Car1(5, 5, 5); // Wait for the road to load
        car.position.set(1, 5.85, 497);
        car.rotation.y = Math.PI;
        car.castShadow = true; // car casts shadow
        car.receiveShadow = true; // car receives shadow
        platform.add(car); // Add the car to the platform/group
    
        // Call the animation loop
        animate();
      } catch (error) {
        console.alert('Error loading car:', error);
      }
    }

    async function unTruck() {
      try {
        const truck = await Un_truck(40, 40, 40); // Wait for the road to load
        truck.position.set(75, 8.55, 497);
        truck.rotation.y = 2*Math.PI;
        truck.castShadow = true; // truck casts shadow
        truck.receiveShadow = true; // truck receives shadow
        platform.add(truck); // Add the truck to the platform/group
    
        // Call the animation loop
        animate();
      } catch (error) {
        console.alert('Error loading truck:', error);
      }
    }

    async function unTruck1() {
      try {
        const truck = await Un_truck(40, 40, 40); // Wait for the road to load
        truck.position.set(-75, 8.55, 497);
        truck.rotation.y = Math.PI/2;
        truck.castShadow = true; // truck casts shadow
        truck.receiveShadow = true; // truck receives shadow
        platform.add(truck); // Add the truck to the platform/group
    
        // Call the animation loop
        animate();
      } catch (error) {
        console.alert('Error loading truck:', error);
      }
    }
    

    // Load the duck model as the player
    const duck_loader = new GLTFLoader();
    let duck;
    duck_loader.load('Rubber_Duck_3d.glb', (gltfScene) => {
      duck = gltfScene.scene;
      duck.position.y = 1.5;
      duck.position.z = 499.5;
      duck.scale.set(10, 10, 10); // Scale the duck
      duck.rotation.y = Math.PI; // Rotate to face the correct direction
      duck.castShadow = true; // Duck casts shadow
      duck.receiveShadow = true; // Duck receives shadow
      platform.add(duck);

      // Movement variables for the duck (player)
      const speed = 0.4;
      const keysPressed = {};
      let isJumping = false; // To prevent double jumps
      let verticalVelocity = 0; // Jump velocity
      const gravity = -0.01; // Simulated gravity
      const groundLevel = duck.position.y; // Player's resting position

      // Mouse control variables (camera)
      let yaw = 0; // Horizontal rotation (yaw)
      let pitch = 0; // Vertical rotation (pitch)

      // Add event listeners for keyboard controls
      function handleKeyDown(event) {
        keysPressed[event.key] = true;
        if (event.key === ' ' && !isJumping) {
          isJumping = true;
          verticalVelocity = 0.2; // Initial jump velocity
        }
      }

      function handleKeyUp(event) {
        keysPressed[event.key] = false;
      }

      // Pointer lock and mouse movement for camera control
      function onMouseMove(event) {
        if (document.pointerLockElement === renderer.domElement) {
          yaw -= event.movementX * sensitivity; // Horizontal rotation (yaw)
          pitch -= event.movementY * sensitivity; // Vertical rotation (pitch)

          // Limit vertical rotation (pitch) to a max of 90 degrees up and down
          pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        }
      }

      function onClick() {
        // Request pointer lock on mouse click
        renderer.domElement.requestPointerLock();
      }

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('click', onClick);

      // Update camera to follow the duck and rotate the duck based on yaw
      function updateCameraAndDuck() {
        // Position the camera behind the duck based on yaw
        const cameraDistance = 10; // Distance between duck and camera
        camera.position.x = duck.position.x + Math.sin(yaw) * cameraDistance;
        camera.position.z = duck.position.z + Math.cos(yaw) * cameraDistance;
        camera.position.y = duck.position.y + 5; // Height offset
        camera.lookAt(duck.position); // Always look at the duck

        // Rotate duck based on yaw to face the camera's movement direction
        duck.rotation.y = yaw + Math.PI;
      }

      // Animation loop
      function animate() {
        // Define platform boundaries
        const platformMinX = -99.5;
        const platformMaxX = 99.5;
        const platformMinZ = -499.5;
        const platformMaxZ = 499.5;

        // Move duck based on key inputs
        if (keysPressed['s'] || keysPressed['ArrowDown']) {
          duck.position.x += speed * Math.sin(yaw); // Move in the direction of yaw
          duck.position.z += speed * Math.cos(yaw);
        }

        if (keysPressed['w'] || keysPressed['ArrowUp']) {
          duck.position.x -= speed * Math.sin(yaw); // Move backward
          duck.position.z -= speed * Math.cos(yaw);
        }

        if (keysPressed['a'] || keysPressed['ArrowLeft']) {
          duck.position.x -= speed * Math.cos(yaw); // Move left
          duck.position.z += speed * Math.sin(yaw);
        }

        if (keysPressed['d'] || keysPressed['ArrowRight']) {
          duck.position.x += speed * Math.cos(yaw); // Move right
          duck.position.z -= speed * Math.sin(yaw);
        }

        // Clamp duck position within the platform boundaries
        duck.position.x = Math.max(platformMinX, Math.min(platformMaxX, duck.position.x));
        duck.position.z = Math.max(platformMinZ, Math.min(platformMaxZ, duck.position.z));

        // Handle jump
        if (isJumping) {
          duck.position.y += verticalVelocity; // Update duck's vertical position
          verticalVelocity += gravity; // Apply gravity

          // Check if the duck lands back on the platform
          if (duck.position.y <= groundLevel) {
            duck.position.y = groundLevel;
            isJumping = false; // End jump
            verticalVelocity = 0; // Reset vertical velocity
          }
        }

        updateCameraAndDuck(); // Update camera and duck positions
        renderer.render(scene, camera); // Render scene

        requestAnimationFrame(animate); // Loop animation
      }
      road();
      unTruck();
      unTruck1();
      car1();
      animate(); // Start the animation loop
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    return () => {
      // Cleanup on component unmount
      window.removeEventListener('resize', () => {});
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      sceneRef.current = null; // Clear the ref on unmount
    };
  }, []);

  return <div></div>;
}

export default Scene;
