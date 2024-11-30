import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Road as an async function that returns a Promise
const Un_truck = (x, y, z) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'un_truck_1.glb',
      (un_truck) => {
        const truck = un_truck.scene;
        truck.scale.set(x, y, z);
        resolve(truck); // Resolve the promise with the loaded road
      },
      undefined,
      (error) => {
        console.error('Error loading Truck:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default Un_truck;
