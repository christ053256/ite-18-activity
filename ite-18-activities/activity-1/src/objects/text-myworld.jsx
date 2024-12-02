// MyWorld.jsx
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Correct import for FontLoader
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; // Correct import for TextGeometry

const MyWorld = () => {
  // Create the text geometry using a promise to handle font loading asynchronously
  const loader = new FontLoader();
  const textGeometry = new Promise((resolve, reject) => {
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', // Font from the Three.js examples
      (font) => {
        const geometry = new TextGeometry('MY WORLD', {
          font: font,
          size: 5,
          height: 1,
        });
        geometry.center(); // Center the text
        resolve(geometry);
      },
      undefined,
      (error) => reject(error)
    );
  });

  // Lighting and material will be added later in App.jsx
  const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    roughness: 0.5,
    metalness: 0.5,
  });

  // Return the text geometry and material, which will be used in the App.jsx for rendering
  return {
    textGeometry,
    material,
  };
};

export default MyWorld;
