import * as THREE from 'three';


const roadTexture = new THREE.TextureLoader().load("stone_road4k.jpg");
const roadDisp = new THREE.TextureLoader().load("stone_road_disp_4k.png");

const Road = (x, y, z) => {
  // Define road geometry (wide and long, to look like a road)
  const roadGeometry = new THREE.BoxGeometry(x, y, z); // Adjust the width and length

  // Create the material using the texture
  const roadMaterial = new THREE.MeshPhongMaterial({
    map: roadTexture,
  });

  // Create the road mesh with the geometry and material
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  return road;
};

export default Road;
