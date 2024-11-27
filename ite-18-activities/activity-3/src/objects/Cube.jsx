import * as THREE from 'three';

const Cube = () => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  
  return cube;
};

export default Cube;