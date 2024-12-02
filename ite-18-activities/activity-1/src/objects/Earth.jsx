import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Road as an async function that returns a Promise
const Earth = (x, y, z) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'earth1.glb',
      (myEarth) => {
        const earth = myEarth.scene;
        earth.scale.set(x, y, z);
        resolve(earth); // Resolve the promise with the loaded road
      },
      undefined,
      (error) => {
        console.error('Error loading road:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default Earth;
