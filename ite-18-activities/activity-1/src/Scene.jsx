// Implement the word here!!!

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Lighting from './objects/Lighting.jsx';
import Earth from './objects/Earth.jsx';
import Moon from './objects/Moon.jsx';
//import MyWorld from './objects/text-myworld.jsx';
const ThreeScene = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  let camera, scene, renderer; // Define variables at a higher scope
  let earth, moon;

  useEffect(() => {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const { ambientLight, directionalLight } = Lighting(0.5, 0.75, -1);
    scene.add(ambientLight);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
    hemisphereLight.position.set(-10, 5, 0);
    scene.add(hemisphereLight);

    const light = new THREE.PointLight(0x807f7f, 10000);
    light.position.set(15, 5, 15);
    light.castShadow = true;
    scene.add(light);

    // Position camera
    camera.position.z = 25;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Resize handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const earthRadius = 5;
    
    async function loadEarth() {
      try {
        setLoading(true); // Set loading to true before starting to load Earth
        earth = await Earth(earthRadius, earthRadius, earthRadius);
        earth.position.set(0, 0, 0);
        earth.rotation.y = Math.PI;
        earth.castShadow = true; 
        earth.receiveShadow = true; 
        scene.add(earth);
      } catch (error) {
        console.error('Error loading Earth:', error); 
      }
    }

    const moonRadius = earthRadius * 0.27;
    const moonDistanceFromEarth = 10; // Distance from Earth's center to Moon's center

    async function loadMoon() {
      try {
        moon = await Moon(moonRadius, moonRadius, moonRadius); 
        moon.position.set(moonDistanceFromEarth + earthRadius + moonRadius + 1, 0, 0); // Set initial position relative to Earth
        moon.rotation.y = Math.PI;
        moon.castShadow = true; 
        moon.receiveShadow = true; 
        scene.add(moon);
      } catch (error) {
        console.error('Error loading Moon:', error); 
      }
    }
   

    async function init() {
      await Promise.all([loadEarth(), loadMoon()]); // Wait for all assets to load
      setLoading(false); // Set loading to false after all are loaded
      animate(); // Start animation after everything is loaded
    }

    function animate() {
      requestAnimationFrame(animate);

      if (earth) {
        earth.rotation.y += 0.01; // Rotate Earth
      }

      if (moon) {
        moon.rotation.y += 0.01; // Rotate Moon around its own axis
        moon.position.x = earth.position.x + (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.cos(Date.now() * 0.001); // Orbit logic
        moon.position.z = (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.sin(-(Date.now() * 0.001)); // Orbit logic
      }

      controls.update();
      renderer.render(scene, camera);
    }

    init(); // Initialize scene and load objects
    animate();
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup resize listener
      mountRef.current.removeChild(renderer.domElement); // Cleanup renderer on unmount
      if (renderer) renderer.dispose(); // Dispose of the renderer properly
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} />
      {loading && <div className="loading-indicator">Loading...</div>} {/* Loading indicator */}
      
      <style>
        {`
          * {
            background-color: black;
            margin: 0;
            padding: 0;
          }

          .loading-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: white;
            z-index: 10; /* Ensure it appears above everything else */
          }
        `}
      </style>
    </div>
  );
};

export default ThreeScene;
