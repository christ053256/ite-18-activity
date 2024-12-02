import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Road as an async function that returns a Promise
const Moon = (x, y, z) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'the_moon.glb',
      (myMoon) => {
        const moon = myMoon.scene;
        moon.scale.set(x, y, z);
        resolve(moon); // Resolve the promise with the loaded road
      },
      undefined,
      (error) => {
        console.error('Error loading road:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default Moon;
