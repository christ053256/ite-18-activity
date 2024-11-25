import React, { useEffect } from 'react';
import * as THREE from 'three';

function Scene() {
  useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create platform (floor)
    const platformGeometry = new THREE.BoxGeometry(100, 1, 200);
    const platformMaterial = [
      new THREE.MeshBasicMaterial({ color: '#B8D8D8' }),
      new THREE.MeshBasicMaterial({ color: '#7A9E9F' }),
      new THREE.MeshBasicMaterial({ color: '#4F6367' }),
      new THREE.MeshBasicMaterial({ color: '#EEF5DB' }),
      new THREE.MeshBasicMaterial({ color: '#FE5F55' }),
      new THREE.MeshBasicMaterial({ color: '#628395' }),
    ];
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    scene.add(platform);

    // Create player (box)
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = [
      new THREE.MeshBasicMaterial({ color: '#98D2EB' }),
      new THREE.MeshBasicMaterial({ color: '#E1F2FE' }),
      new THREE.MeshBasicMaterial({ color: '#B2B1CF' }),
      new THREE.MeshBasicMaterial({ color: '#77625C' }),
      new THREE.MeshBasicMaterial({ color: '#49392C' }),
      new THREE.MeshBasicMaterial({ color: '#628395' }),
    ];
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1; // Position above the platform
    player.position.z = 9.5;
    scene.add(player);

    // Camera initial position
    camera.position.z = 3;
    camera.position.y = 5;
    camera.lookAt(player.position); // Start by looking at the player

    // Movement variables
    const speed = 1;
    const keysPressed = {};
    let isJumping = false; // To prevent double jumps
    let verticalVelocity = 0; // Jump velocity
    const gravity = -0.0001; // Simulated gravity
    const groundLevel = 1; // Player's resting position

    // Mouse control variables (camera)
    let yaw = 0; // Horizontal rotation (yaw)
    let pitch = 0; // Vertical rotation (pitch)
    const sensitivity = 0.002; // Adjust this for slower/faster camera rotation

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

    // Update camera to follow the player
    function updateCamera() {
      // Position the camera behind the player based on yaw
      const cameraDistance = 10; // Distance between player and camera
      camera.position.x = player.position.x + Math.sin(yaw) * cameraDistance;
      camera.position.z = player.position.z + Math.cos(yaw) * cameraDistance;
      camera.position.y = player.position.y + 5; // Height offset
      camera.lookAt(player.position); // Always look at the player
    }

    // Animation loop
    function animate() {
      // Define platform boundaries
      const platformMinX = -49.5;
      const platformMaxX = 49.5;
      const platformMinZ = -99.5;
      const platformMaxZ = 99.5;
    
      // Move player based on key inputs
      if (keysPressed['s'] || keysPressed['ArrowDown']) {
        player.position.x += speed * Math.sin(yaw); // Move in the direction of yaw
        player.position.z += speed * Math.cos(yaw);
      }
    
      if (keysPressed['w'] || keysPressed['ArrowUp']) {
        player.position.x -= speed * Math.sin(yaw); // Move backward
        player.position.z -= speed * Math.cos(yaw);
      }
    
      if (keysPressed['a'] || keysPressed['ArrowLeft']) {
        player.position.x -= speed * Math.cos(yaw); // Move left
        player.position.z += speed * Math.sin(yaw);
      }
    
      if (keysPressed['d'] || keysPressed['ArrowRight']) {
        player.position.x += speed * Math.cos(yaw); // Move right
        player.position.z -= speed * Math.sin(yaw);
      }
    
      // Clamp player position within the platform boundaries
      player.position.x = Math.max(platformMinX, Math.min(platformMaxX, player.position.x));
      player.position.z = Math.max(platformMinZ, Math.min(platformMaxZ, player.position.z));
    
      // Handle jump
      if (isJumping) {
        player.position.y += verticalVelocity; // Update player's vertical position
        verticalVelocity += gravity; // Apply gravity
    
        // Check if the player lands back on the platform
        if (player.position.y <= groundLevel) {
          player.position.y = groundLevel; // Reset to ground level
          isJumping = false; // Allow jumping again
          verticalVelocity = 0; // Reset velocity
        }
      }
    
      // Update camera position to follow the player
      updateCamera();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.remove();
    };
  }, []);

  return null; // React components must return JSX; return null since the canvas is appended directly
}

export default Scene;
