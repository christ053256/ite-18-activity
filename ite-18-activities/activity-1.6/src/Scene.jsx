// src/components/ThreeScene.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Sphere from './objects/Sphere.jsx';
import Lighting from './objects/Lighting.jsx';

const ThreeScene = () => {
  const mountRef = useRef(null);

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const earthTexture = new THREE.TextureLoader().load('/src/public/assets/earthmap1k.jpg');
  //const moonTexture = new THREE.TextureLoader().load('/src/public/assets/moonmap4k.jpg');

  //Use this if you want to automatically resize the window
  const reSizeOnWindow = () => {
    window.addEventListener('resize', () =>
      {
      // Update sizes
      windowSize.width = window.innerWidth
      windowSize.height = window.innerHeight
      // Update camera
      camera.aspect = windowSize.width / windowSize.height
      // Update renderer
      renderer.setSize(windowSize.width, windowSize.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })
  }

  useEffect(() => {
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowSize.width, windowSize.height);
    mountRef.current.appendChild(renderer.domElement);


    // Create and add objects to the scene
    const earthMaterial = {
      map: earthTexture
    }

    const moonMaterial = {
      map: earthTexture
    }
    const earth = Sphere(earthMaterial, 1, 25, 25);
    earth.rotation.x = THREE.MathUtils.degToRad(23.5);
 
    const moon = Sphere(moonMaterial, 0.8, 25, 25);
    moon.position.x = 2;
    moon.position.y = 2;

    
    const { ambientLight, directionalLight } = Lighting();
    const axesHelper = new THREE.AxesHelper(5);  // The size of the axes helper (5 units long)
    earth.add(axesHelper);


    //Add to scenes
    scene.add(earth);
    scene.add(moon);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;

    //Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate objects
      earth.rotation.y += 0.05;
      // Render the scene from camera's perspective
      controls.update()
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;
