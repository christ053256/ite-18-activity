import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui'; // Import dat.GUI
import './Scene.css';

import loadObject from './components/LoadObject';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0); // State for loading progress

    useEffect(() => {
        const scene = new THREE.Scene();
        //scene.background = new THREE.Color('#ffff00'); // Set background color to white
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;
        camera.position.y = 15;
        camera.position.y = 15;
        

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Choose shadow map type

        
        async function loadPiano(x = 1, z = 1, sx = 1,sy = 1, sz = 1) {
            try {
              const piano = await loadObject('grand_piano.glb', sx, sy, sz, setLoadingProgress); // Load object model with progress callback
              setLoading(false); // Set loading to false after first render
              piano.position.y = 1;
              piano.castShadow = true;
              piano.receiveShadow = true;
              piano.rotation.y = Math.PI/2;
      
              piano.position.x = x;
              piano.position.z = z;
              scene.add(piano);
      
            } catch (error) {
              console.error('Error loading player:', error);
              setLoading(false); // Stop loading indicator on error
            }
        }
        //Objects
        const geometry = new THREE.BoxGeometry(50, 2, 50);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
        })
        const box = new THREE.Mesh(geometry, material);
        box.receiveShadow = true;
        box.position.y = -5;
        scene.add(box);

        const geometry1 = new THREE.BoxGeometry(10, 10, 10);
        const box1 = new THREE.Mesh(geometry1, material);
        box1.castShadow = true;
        scene.add(box1);
        //Lights
        const al = new THREE.AmbientLight(0xfffff, 0.3);
        scene.add(al);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
        scene.add(directionLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/8, 0);
        spotLight.position.set(10, 20, 10);
        spotLight.castShadow = true; // Enable shadow casting

        spotLight.shadow.mapSize.width = 5; // Shadow resolution
        spotLight.shadow.mapSize.height = 5;
        spotLight.shadow.camera.near = 0.5; // Adjust shadow camera properties
        spotLight.shadow.camera.far = 3;

        const slHelper = new THREE.SpotLightHelper(spotLight);

        scene.add(spotLight, slHelper);


    


        




        mountRef.current.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        
        function animate(){
            requestAnimationFrame(animate);

            controls.update();
            renderer.render(scene, camera);
        }

        animate();
        //loadPiano();
        
        // Resize handling
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);
    
    // Cleanup resources on component unmount
    return () => {
        window.removeEventListener('resize', handleResize);
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      };
    }, []);


    return (
        <div>
        <div ref={mountRef} />
        </div>
    );
};

export default ThreeScene;
