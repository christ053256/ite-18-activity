// src/objects/Sphere.jsx
import * as THREE from 'three';

const Sphere = (objectMaterial, radius, widthSegments, heightSegments) => {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  
  // Create material and apply the texture
  const material = new THREE.MeshMatcapMaterial(objectMaterial);
  
  // Create the mesh with the geometry and material
  const sphere = new THREE.Mesh(geometry, material);
  
  return sphere;
};

export default Sphere;
