import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Road as an async function that returns a Promise
const Car1 = (x, y, z) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'simca_1000_1966.glb',
      (car) => {
        const car1 = car.scene;
        car1.scale.set(x, y, z);
        resolve(car1); // Resolve the promise with the loaded road
      },
      undefined,
      (error) => {
        console.error('Error loading road:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default Car1;
