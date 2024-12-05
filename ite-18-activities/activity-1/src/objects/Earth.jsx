import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Earth as an async function that returns a Promise
const Earth = (x, y, z, onProgress) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'earth1.glb',
      (myEarth) => {
        const earth = myEarth.scene;
        earth.scale.set(x, y, z);
        resolve(earth); // Resolve the promise with the loaded earth
      },
      onProgress, // Pass the progress callback here
      (error) => {
        console.error('Error loading Earth:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default Earth;