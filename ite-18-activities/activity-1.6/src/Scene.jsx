// src/components/ThreeScene.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Cube from './objects/Cube.jsx';
import Sphere from './objects/Sphere.jsx';
import Lighting from './objects/Lighting.jsx';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create and add objects to the scene
    const cube = Cube();
    const cube1 = Cube();
    const sphere = Sphere();
    const { ambientLight, directionalLight } = Lighting();
    

    cube.position.x = 3;
    cube.position.y = 3;

    cube1.position.x = -3;
    cube1.position.y = -3;
    scene.add(cube);
    scene.add(cube1);
    scene.add(sphere);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate objects
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      cube1.rotation.x += 0.05;
      cube1.rotation.y += 0.05;

      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      // Render the scene from camera's perspective
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
