import * as THREE from 'three';

const Platform = (x, y, z) => {
    const platformGeometry = new THREE.BoxGeometry(x, y, z);
    const platformMaterial = [
      new THREE.MeshPhongMaterial({ color: '#B8D8D8' }),
      new THREE.MeshPhongMaterial({ color: '#7A9E9F' }),
      new THREE.MeshPhongMaterial({ color: '#4F6367' }),
      new THREE.MeshPhongMaterial({ color: '#EEF5DB' }),
      new THREE.MeshPhongMaterial({ color: '#FE5F55' }),
      new THREE.MeshPhongMaterial({ color: '#628395' }),
    ];
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);

    return platform;
};

export default Platform;