import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as dat from 'dat.gui'

let mouseX = 0, mouseY = 0

let myObj

// Debug
const gui = new dat.GUI()

// instantiate a loader
const loader = new OBJLoader()
const manager = new THREE.LoadingManager()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Materials
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load( 'models/hotdog-3/Hotdog_BaseColor.png' )

// Scene
const scene = new THREE.Scene()

// load a resource
loader.load(
  // resource URL
  'models/hotdog-3/Hotdog.obj',
  // called when resource is loaded
  function ( object ) {

    object.traverse( function ( child ) {

      if ( child.isMesh ) {
        child.material.map = texture
        child.castShadow = true
        child.receiveShadow = true
      }

    } )

    myObj = object

    scene.add( object )

  },
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
  },
  function ( error ) {
    console.error( error )
  }
)

// Transparent Ground Plane
var planeGeometry = new THREE.PlaneGeometry( 25, 25 )
planeGeometry.rotateX( - Math.PI / 2 )

var planeMaterial = new THREE.ShadowMaterial()
planeMaterial.opacity = 0.02

var plane = new THREE.Mesh( planeGeometry, planeMaterial )
plane.position.y = -2
plane.receiveShadow = true

scene.add( plane )

// Lights
const light = new THREE.PointLight( 0xffffff, 0.5, 100, 2 )
light.position.set( 0, 55, 0 )
light.castShadow = true
light.shadow.radius = 10
light.shadow.mapSize.width = 4000
light.shadow.mapSize.height = 4000

scene.add( light )

const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.8 )
scene.add( ambientLight )

const ambientLight2 = new THREE.AmbientLight( 0xcccccc, 0.3 )
ambientLight2.position.y = 10
scene.add( ambientLight2 )

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1.5
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false
controls.enablePan = false
controls.autoRotate = true
controls.minPolarAngle = Math.PI / 3.25
controls.maxPolarAngle = Math.PI / 2.4

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
  camera.lookAt( scene.position )


  // Update Orbital Controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
