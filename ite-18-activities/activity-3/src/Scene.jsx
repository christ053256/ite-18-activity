import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import './Scene.css';
import Road from './objects/Road.jsx';

function Scene() {
  const [sensitivity, setSensitivity] = useState(0.001); // Default sensitivity
  const [settingsVisible, setSettingsVisible] = useState(false); // Control visibility of settings

  useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows
    renderer.logarithmicDepthBuffer = true;
    document.body.appendChild(renderer.domElement);

    // Create light sources
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light (simulates sunlight)
    directionalLight.position.set(10, 10, 10); // Position light above and to the side
    directionalLight.castShadow = true; // Enable shadow casting
    scene.add(directionalLight);

    // Adjust directional light's shadow properties
    directionalLight.shadow.mapSize.width = 512; // Shadow map width
    directionalLight.shadow.mapSize.height = 512; // Shadow map height
    directionalLight.shadow.camera.near = 0.1; // Near clipping plane for shadows
    directionalLight.shadow.camera.far = 50; // Far clipping plane for shadows
    directionalLight.shadow.camera.left = -50; // Left edge of the shadow camera
    directionalLight.shadow.camera.right = 50; // Right edge of the shadow camera
    directionalLight.shadow.camera.top = 50; // Top edge of the shadow camera
    directionalLight.shadow.camera.bottom = -50; // Bottom edge of the shadow camera

    // Create platform (floor)
    // const platformGeometry = new THREE.BoxGeometry(200, 1, 1000);
    // const platformMaterial = [
    //   new THREE.MeshPhongMaterial({ color: '#B8D8D8' }),
    //   new THREE.MeshPhongMaterial({ color: '#7A9E9F' }),
    //   new THREE.MeshPhongMaterial({ color: '#4F6367' }),
    //   new THREE.MeshPhongMaterial({ color: '#EEF5DB' }),
    //   new THREE.MeshPhongMaterial({ color: '#FE5F55' }),
    //   new THREE.MeshPhongMaterial({ color: '#628395' }),
    // ];
    // const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    // platform.receiveShadow = true; // Platform receives shadows
    // platform.castShadow = true;
    // scene.add(platform);

    // Create road and set shadow properties
    const roadMap1 = Road(200, 1, 100);
    roadMap1.position.y = 0.0005;
    roadMap1.castShadow = true; // Road casts shadow
    roadMap1.receiveShadow = true; // Road receives shadow
    roadMap1.position.z = 499;
    scene.add(roadMap1);

    const roadMap2 = Road(200, 1, 125);
    roadMap2.position.y = 0.0005;
    roadMap2.castShadow = true; // Road casts shadow
    roadMap2.receiveShadow = true; // Road receives shadow
    roadMap2.position.z = 369.75;
    scene.add(roadMap2);

    const roadMap3 = Road(200, 1, 250);
    roadMap3.position.y = 0.0005;
    roadMap3.castShadow = true; // Road casts shadow
    roadMap3.receiveShadow = true; // Road receives shadow
    roadMap3.position.z = 165.5;
    scene.add(roadMap3);

    const roadMap4 = Road(200, 1, 150);
    roadMap4.position.y = 0.0005;
    roadMap4.castShadow = true; // Road casts shadow
    roadMap4.receiveShadow = true; // Road receives shadow
    roadMap4.position.z = -50.5;
    scene.add(roadMap4);

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
    player.position.z = 499.5;
    player.castShadow = true; // Player casts shadow
    player.receiveShadow = true; // Player receives shadow
    scene.add(player);

    // Camera initial position
    camera.position.z = 3;
    camera.position.y = 5;
    camera.lookAt(player.position); // Start by looking at the player

    // Movement variables
    const speed = 0.4;
    const keysPressed = {};
    let isJumping = false; // To prevent double jumps
    let verticalVelocity = 0; // Jump velocity
    const gravity = -0.01; // Simulated gravity
    const groundLevel = 1; // Player's resting position

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

      // Toggle the settings visibility when the player presses the "Esc" key
      if (event.key === 'Escape') {
        setSettingsVisible(!settingsVisible);
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

        // Rotate the player based on horizontal mouse movement (yaw)
        player.rotation.y = yaw; // Update player's rotation
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
      const platformMinX = -99.5;
      const platformMaxX = 99.5;
      const platformMinZ = -499.5;
      const platformMaxZ = 499.5;
    
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
  }, [sensitivity, settingsVisible]); // Re-run the effect whenever sensitivity or visibility changes

  // Function to adjust sensitivity by -0.5% or +0.5%
  const adjustSensitivity = (increment) => {
    setSensitivity((prevSensitivity) => {
      const newSensitivity = prevSensitivity * (increment ? 1.005 : 0.995);
      return Math.min(Math.max(newSensitivity, 0.0005), 0.01); // Clamp between 0.0005 and 0.01
    });
  };

  return (
    <div>
      {settingsVisible && (
        <div className="mouse-sensitivity">
          <label htmlFor="sensitivity-slider">Mouse Sensitivity: </label>
          <button className="subtract-sensitivity" onClick={() => adjustSensitivity(false)}>−</button>
          <input
            id="sensitivity-slider"
            type="range"
            min="0.0005"
            max="0.01"
            step="0.0005"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          />
          <button className="add-sensitivity" onClick={() => adjustSensitivity(true)}>+</button>
          <span>{(sensitivity * 1000).toFixed(2)}%</span> {/* Display sensitivity percentage */}
        </div>
      )}
    </div>
  );
}

export default Scene;
