// src/objects/Lighting.jsx
import * as THREE from 'three';

const Lighting = () => {
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional white light
  
  directionalLight.position.set(5, 5, 5); // Position the light

  return { ambientLight, directionalLight };
};

export default Lighting;
