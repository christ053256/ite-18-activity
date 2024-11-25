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

    // Create scene
    const scene = new THREE.Scene();

    // Create camera, renderer
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowSize.width, windowSize.height);
    mountRef.current.appendChild(renderer.domElement);


    // Earth material
    const earthMaterial = { 
      map: earthTexture, 
      normalMap: earthCloudeTexture,
      roughness: 0.5,
      color: 0xffffff,
      shininess: 30,
    };
    // Moon material
    const moonMaterial = { 
      map: moonTexture, 
      //normalMap: normalMoonTexture,
      roughness: 0.3,
      color: 0xffffff,
      shininess: 10,
    };


    // Create Earth and Moon meshes
    const earthRadius = 20;
    const earth = Sphere(earthMaterial, earthRadius, 25, 25);
    earth.rotation.x = THREE.MathUtils.degToRad(23.5);  // Earth tilt

    const moonDistanceFromEarth = earthRadius * 5;
    const moon = Sphere(moonMaterial, (earthRadius * 0.27), 25, 25);
    moon.position.set(moonDistanceFromEarth, 0, 0);  // Initial position of the moon

    //Add axes helper to Earth for debugging
    const axesHelper = new THREE.AxesHelper(5);  // The size of the axes helper (5 units long)

    // Lighting
    const { ambientLight, directionalLight } = Lighting(0.5, 0.75, -1);

    // Add other lights
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Add Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2); // Sky color, ground color, intensity
    hemisphereLight.position.set(-10, 5, 0); // Position above the Earth
    scene.add(hemisphereLight);

    const light = new THREE.PointLight( 0x807f7f, 10000);
    light.position.set(15, 5, 15);
    light.castShadow = true;
    scene.add(light);
    
    
    // Add Earth and Moon to the scen
    scene.add(earth);
    scene.add(moon);

    // Position camera
    camera.position.z = 150;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    const moonRotation = 0.01;
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate Earth on its own axis (faster)
      earth.rotation.y += moonRotation*0.03;

      // Revolve Moon around Earth (slower revolution)
      const time = Date.now() * 0.001;  // Time-based parameter for smooth animation
      moon.position.x = (-moonDistanceFromEarth * Math.cos(-time));  // Moon's position based on cosine (X)
      moon.position.z = (-moonDistanceFromEarth * Math.sin(-time));  // Moon's position based on sine (Z)

      // Rotate Moon on its own axis (optional)
      moon.rotation.y += moonRotation;

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