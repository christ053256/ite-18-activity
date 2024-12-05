import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Lighting from './objects/Lighting.jsx';
import Earth from './objects/Earth.jsx';
import Moon from './objects/Moon.jsx';

const ThreeScene = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0); // State for loading percentage
  let camera, scene, renderer;
  let earth, moon; // These will be set after the objects are loaded

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
    const moonRadius = earthRadius * 0.27;
    const moonDistanceFromEarth = 10;

    // Create and load Earth
    const loadEarth = async () => {
      try {
        setLoading(true);
        const loadedEarth = await Earth(earthRadius, earthRadius, earthRadius, (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            setLoadingPercentage(Math.round(percentComplete)); // Update loading percentage
          }
        });

        // Check if loadedEarth is a valid THREE.Object3D instance
        if (loadedEarth instanceof THREE.Object3D) {
          earth = loadedEarth;
          earth.position.set(0, 0, 0);
          earth.rotation.y = Math.PI;
          earth.castShadow = true;
          earth.receiveShadow = true;
          scene.add(earth);
        } else {
          console.error("Earth failed to load: Not a valid THREE.Object3D instance.");
        }
      } catch (error) {
        console.error('Error loading Earth:', error);
      }
    };

    // Create and load Moon
    const loadMoon = async () => {
      try {
        moon = await Moon(moonRadius, moonRadius, moonRadius);

        // Check if moon is a valid THREE.Object3D instance
        if (moon instanceof THREE.Object3D) {
          moon.position.set(moonDistanceFromEarth + earthRadius + moonRadius + 1, 0, 0);
          moon.rotation.y = Math.PI;
          moon.castShadow = true;
          moon.receiveShadow = true;
          scene.add(moon);
        } else {
          console.error("Moon failed to load: Not a valid THREE.Object3D instance.");
        }
      } catch (error) {
        console.error('Error loading Moon:', error);
      }
    };

    // Initialize scene and load objects
    const init = async () => {
      await Promise.all([loadEarth(), loadMoon()]);
      setLoading(false);
      animate(); // Start animation after everything is loaded
    };

    function animate() {
      requestAnimationFrame(animate);

      // Rotate Earth around its own axis
      if (earth) {
        earth.rotation.y += 0.01; // Rotate Earth
      }

      // Update Moon's position to orbit around Earth
      if (moon) {
        moon.rotation.y += 0.01; // Rotate Moon around its own axis
        moon.position.x = earth.position.x + (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.cos(Date.now() * 0.001);
        moon.position.z = earth.position.z + (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.sin(-(Date.now() * 0.001));
      }

      controls.update();
      renderer.render(scene, camera);
    }

    init();

    // Cleanup resources on component unmount
    return () => {
      // Ensure earth and moon are defined before attempting cleanup
      if (earth) {
        if (earth.geometry) earth.geometry.dispose();
        if (earth.material) earth.material.dispose();
        scene.remove(earth);
      }

      if (moon) {
        if (moon.geometry) moon.geometry.dispose();
        if (moon.material) moon.material.dispose();
        scene.remove(moon);
      }

      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} />
      {loading && (
        <div className="loading-indicator">
          Loading... {loadingPercentage}%
        </div>
      )}

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
