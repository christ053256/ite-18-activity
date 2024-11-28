import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Define Road as an async function that returns a Promise
const RoadSigned = (x, y, z) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'funny_indian_road_sign_3.glb',
      (road_signed) => {
        const roadSigned = road_signed.scene;
        roadSigned.scale.set(x, y, z);
        resolve(roadSigned); // Resolve the promise with the loaded road
      },
      undefined,
      (error) => {
        console.error('Error loading road:', error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

export default RoadSigned;
