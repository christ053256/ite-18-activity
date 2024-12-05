import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Lighting from './objects/Lighting.jsx';
import Earth from './objects/Earth.jsx';
import Moon from './objects/Moon.jsx';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { GUI } from 'lil-gui'; // Import dat.GUI
import './Scene.css';

const ThreeScene = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  let camera, scene, renderer;
  let earth, moon, textMesh, moonTextMesh, axisHelper;

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
    camera.position.z = 30;

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
            setLoadingPercentage(Math.round(percentComplete));
          }
        });

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


    const fontLoader = new FontLoader();
    fontLoader.load(
      'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
      (droidFont) => {
        const textGeometry = new TextGeometry('Earth', {
          height: 1,
          size: 3,
          font: droidFont,
        });
        const textMaterial = new THREE.MeshNormalMaterial();
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);
      }
    );

    // Load "Moon" Text
    fontLoader.load(
      'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
      (droidFont) => {
        const textGeometry = new TextGeometry('Moon', {
          height: 1,
          size: 2,
          font: droidFont,
        });
        const textMaterial = new THREE.MeshNormalMaterial();
        moonTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(moonTextMesh);
      }
    );

    // Create AxesHelper
    axisHelper = new THREE.AxesHelper(10);  // Create the axes helper
    scene.add(axisHelper);  // Initially add it to the scene

    // GUI to control the visibility of the AxesHelper
    const gui = new GUI({ title: 'Scene Controls' });
    const controlsGUI = {
      showAxes: true,  // Default visibility
    };

    gui.add(controlsGUI, 'showAxes').onChange((value) => {
      axisHelper.visible = value;  // Toggle visibility based on the GUI control
    });
    
    const earthControls = { rotationSpeed: 0.01 };
    const moonControls =  { rotationSpeed: 0.01 };

    const earthTextVisibility = {
      showText: true, // Initial visibility
    };
    
    gui.add(earthTextVisibility, 'showText')
    .name('Show Earth Text')
    .onChange((value) => {
      if (textMesh) {
        textMesh.visible = value; // Toggle visibility based on GUI control
      }
    });

    const moonTextVisibility = {
      showText: true, // Initial visibility
    };
    
    gui.add(moonTextVisibility, 'showText')
    .name('Show Moon Text')
    .onChange((value) => {
      if (moonTextMesh) {
        moonTextMesh.visible = value; // Toggle visibility based on GUI control
      }
    });
    gui.add(earthControls, 'rotationSpeed', 0, 3).name('Earth Rotation Speed');
    gui.add(moonControls, 'rotationSpeed', 0, 3).name('Moon Rotation Speed');

    
    const guiStyles = document.createElement('style');
    guiStyles.textContent = `
      .lil-gui {
        font-family: 'Arial', sans-serif;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 8px;
        padding: 10px;
      }
      .lil-gui .title {
        font-size: 16px;
        font-weight: bold;
      }
      .lil-gui .controller {
        margin-bottom: 5px;
      }
      .lil-gui .folder {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 5px;
        margin: 5px 0;
      }
    `;
    document.head.appendChild(guiStyles);
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
        earth.rotation.y += earthControls.rotationSpeed;
      }

      // Update Moon's position to orbit around Earth
      if (moon) {
        moon.rotation.y += moonControls.rotationSpeed; // Rotate Moon around its own axis
        moon.position.x = earth.position.x + (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.cos(Date.now() * 0.001);
        moon.position.z = earth.position.z + (moonDistanceFromEarth + earthRadius + moonRadius + 1) * Math.sin(-(Date.now() * 0.001));
      }

      // Update "Moon" text to follow the Moon's position
      if (moonTextMesh && moon) {
        moonTextMesh.position.set(moon.position.x - 3.7, moon.position.y + 2, moon.position.z); // Keep the text slightly above the Moon
        moonTextMesh.rotation.y -= 0.01;
      }

      if (textMesh && earth) {
        textMesh.position.set(earth.position.x - 5, earth.position.y + 2, earth.position.z); // Keep the text slightly above the Moon
        textMesh.rotation.y -= 0.01;
        //textMesh.lookAt(camera.position); // Make the text always face the camera
      }

      controls.update();
      renderer.render(scene, camera);
    }

    init();

    // Cleanup resources on component unmount
    return () => {
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

      if (textMesh) {
        if (textMesh.geometry) textMesh.geometry.dispose();
        if (textMesh.material) textMesh.material.dispose();
        scene.remove(textMesh);
      }

      if (moonTextMesh) {
        if (moonTextMesh.geometry) moonTextMesh.geometry.dispose();
        if (moonTextMesh.material) moonTextMesh.material.dispose();
        scene.remove(moonTextMesh);
      }

      if (axisHelper) {
        scene.remove(axisHelper);  // Clean up the AxesHelper
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
            z-index: 10;
          }
        `}
      </style>
    </div>
  );
};

export default ThreeScene;
