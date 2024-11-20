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
  };

  // Load textures for Earth and Moon
  const earthTexture = new THREE.TextureLoader().load('/earthmap1k.jpg');
  const earthCloudeTexture = new THREE.TextureLoader().load('/earthcloudmap.jpg');
  const moonTexture = new THREE.TextureLoader().load('/mapMoon.jpg');
  const normalMoonTexture = new THREE.TextureLoader().load('/normalMoonMap.jpg');
  const backgroundTexture = new THREE.TextureLoader().load('/starySky.jpg');


  // Window resizing function
  const reSizeOnWindow = () => {
    window.addEventListener('resize', () => {
      windowSize.width = window.innerWidth;
      windowSize.height = window.innerHeight;
      camera.aspect = windowSize.width / windowSize.height;
      renderer.setSize(windowSize.width, windowSize.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  };

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = backgroundTexture;
    scene.backgroundIntensity = 0.3;
    scene.backgroundRotation = (1, 1 ,1);
    scene.environment = 0.3;
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.008);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowSize.width, windowSize.height);
    mountRef.current.appendChild(renderer.domElement);

    // Earth and Moon materials
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture, normalMap: earthCloudeTexture });
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture, normalMap: normalMoonTexture });


    // Create Earth and Moon meshes
    const earthRadius = 1.3;
    const earth = Sphere(earthMaterial, earthRadius, 25, 25);
    earth.rotation.x = THREE.MathUtils.degToRad(23.5);  // Earth tilt

    const moonDistanceFromEarth = 8;
    const moon = Sphere(moonMaterial, (earthRadius * 0.27), 25, 25);
    moon.position.set(moonDistanceFromEarth, 0, 0);  // Initial position of the moon

    // Lighting
    const { ambientLight, directionalLight } = Lighting();

    // Add axes helper to Earth for debugging
    // const axesHelper = new THREE.AxesHelper(5);  // The size of the axes helper (5 units long)
    // earth.add(axesHelper);

    // Add Earth and Moon to the scen
    scene.add(earth);
    scene.add(moon);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 10;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //const parallaxFactor = 0.5;
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      //scene.background.offset.x = camera.position.x * parallaxFactor;
      //scene.background.offset.y = camera.position.y * parallaxFactor;

      // Rotate Earth on its own axis (faster)
      earth.rotation.y += 0.08;

      // Revolve Moon around Earth (slower revolution)
      const time = Date.now() * 0.0001;  // Time-based parameter for smooth animation
      moon.position.x = (-moonDistanceFromEarth * Math.cos(-time));  // Moon's position based on cosine (X)
      moon.position.z = (-moonDistanceFromEarth * Math.sin(-time));  // Moon's position based on sine (Z)

      // Rotate Moon on its own axis (optional)
      moon.rotation.y += 0.05;

      // Update controls
      controls.update();
      
      // Render the scene
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
