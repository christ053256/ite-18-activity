import * as THREE from 'three'


// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ 
    color: '#EA159A'
})
const mesh = new THREE.Mesh(geometry, material)

mesh.scale.x = -2
mesh.scale.y = 1
mesh.scale.z = 0.25

scene.add(mesh)

/**
* Axes Helper
*/



const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Sizes
const sizes = {
    width: 800,
    height: 800
}
// Camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
* Animate
*/
// const tick = () =>
//     {
//     // Update objects
//     mesh.rotation.y += 0.05
//     mesh.rotation.x += 0.08
//     mesh.rotation.z += 0.09
//     // Render
//     renderer.render(scene, camera)
//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
//     }
    
// tick()