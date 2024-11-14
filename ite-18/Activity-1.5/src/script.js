import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5), // Box with subdivisions
    new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red color material
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position) // Make the camera look at the mesh
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // Enable damping for smooth control
controls.dampingFactor = 0.25 // Optional: Adjust damping factor (default is 0.25)

// Animation loop
const tick = () => {
    // Update controls for damping
    controls.update() // Only needed if damping is enabled

    // Render the scene
    renderer.render(scene, camera)

    // Request the next frame
    requestAnimationFrame(tick)
}

// Start the animation loop
tick()
