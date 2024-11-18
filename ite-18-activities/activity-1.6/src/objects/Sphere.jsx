// src/objects/Sphere.jsx
import * as THREE from 'three';

const Sphere = () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);
  
  return sphere;
};

export default Sphere;
