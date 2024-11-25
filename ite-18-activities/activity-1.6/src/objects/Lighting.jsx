// src/objects/Lighting.jsx
import * as THREE from 'three';

const Lighting = (x = 5, y = 5, z = 5) => {
  const ambientLight = new THREE.AmbientLight(0x404040, 4); // Soft white light
  const directionalLight = new THREE.DirectionalLight(0x000000, 4); // Directional white light
  
  directionalLight.position.set(x, y, z).normalize();; // Position the light

  return { ambientLight, directionalLight };
};

export default Lighting;
