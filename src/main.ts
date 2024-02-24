import { AmbientLight, AnimationAction, AnimationClip, AnimationMixer, BackSide, CircleGeometry, Clock, Color, Fog, HemisphereLight, Mesh, MeshDepthMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, Scene, ShaderMaterial, SphereGeometry, TextureLoader, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three'
import './style.css'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
import { FBXLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'
import { getPageOverlayDiv } from './htmlincludes'
import { Group } from 'three/examples/jsm/libs/tween.module.js'

const appDiv: HTMLDivElement = document.querySelector('#app') ?? document.createElement('div')

const canvas: HTMLCanvasElement = document.createElement('canvas')
canvas.id = 'scene'

document.body.append(getPageOverlayDiv())

appDiv.append(canvas)

const renderer = new WebGLRenderer({
canvas: canvas,
antialias: true,
alpha: false, // we don't need this true, its just for the background
logarithmicDepthBuffer: true,
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const renderTarget = new WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight)
renderTarget.samples = 2
//this.renderer.outputColorSpace = SRGBColorSpace
//this.renderer.toneMapping = ACESFilmicToneMapping

// this needs to be set up before the composer

const camera = new PerspectiveCamera(
    90,                                                        // FOV
    canvas.clientWidth / canvas.clientHeight,         // Aspect, updated on resize
    0.1,                                                        // Near
    5000                                              // Far) // will be overwritten in main
)
camera.position.set(0, 10, 18)
camera.lookAt(0, 12, 0)


const scene = new Scene();
scene.background = new Color('white')

import citymapTextureFile from './textures/chemnitzOSM.png'
const citymapTexture = new TextureLoader().load(citymapTextureFile)

const mesh = new Mesh( new CircleGeometry( 40, 50 ), new MeshPhongMaterial() );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = false;
mesh.material.map = citymapTexture
scene.add( mesh )

const hemiLight = new HemisphereLight( 0xfcad83, 0xfcd3f4, 1 );
hemiLight.position.set( 0, 60, 0 );

const vertexShader = document.getElementById( 'vertexShader' ).textContent;
const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
const uniforms = {
    'topColor': { value: new Color( 0xfcad9e ) },
    'bottomColor': { value: new Color( 0xfc03f4 ) },
    'offset': { value: 50 },
    'exponent': { value: 0.7 }
};
uniforms[ 'topColor' ].value.copy( hemiLight.color );
uniforms[ 'bottomColor' ].value.copy( hemiLight.groundColor );


scene.background = new Color().setHSL( 0.6, 0, 1 );
scene.fog = new Fog( scene.background, 1, 5000 );

scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

const skyGeo = new SphereGeometry( 4000, 32, 15 );
const skyMat = new ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: BackSide
} );

const sky = new Mesh( skyGeo, skyMat );
scene.add( sky );


const ambientLight = new AmbientLight(new Color('white'), 1)
const pointLight = new PointLight(new Color('white'), 20, 50, 1)

pointLight.position.set(0, 10, 0)

scene.add(hemiLight)
scene.add(ambientLight)
scene.add(pointLight)

const loader = new FBXLoader();
//const path = require('models/idle_female.fbx')

let loadingFemaleDone: boolean = false
let loadingFemaleWavingDone: boolean = false
let loadingMaleDone: boolean = false
let loadingMaleWavingDone: boolean = false

let animationActions: AnimationAction[] = []

let femaleMixer: any
let femaleAction: any
let femaleWaveAction: any

loader.load( 'models/Idle_female.fbx', function ( female ) {

    female.name = "female"
    female.scale.set(0.1, 0.1, 0.1)
    female.position.set(-7,0,0)
    female.rotateY(Math.PI/3)

    femaleMixer = new AnimationMixer(female)
    femaleAction = femaleMixer.clipAction(female.animations[0])


    animationActions.push(femaleAction)

    loadingFemaleDone = true

    femaleAction.play()
    scene.add(female);



    loader.load( 'models/waving.fbx', function ( wavingObject ) {

        femaleWaveAction = femaleMixer.clipAction(wavingObject.animations[0])
        femaleWaveAction.timeScale = 5

    })

} );



let maleMixer: any
let maleAction: any
let maleWaveAction: any

loader.load( 'models/Idle_male.fbx', function ( male ) {

    male.name = "male"
    male.scale.set(0.1, 0.1, 0.1)
    male.position.set(7,0,0)
    male.rotateY(-Math.PI/3)

    maleMixer = new AnimationMixer(male)
    maleAction = maleMixer.clipAction(male.animations[0])
    


    animationActions.push(maleAction)

    loadingMaleDone = true

    maleAction.play()
    scene.add( male );


    loader.load( 'models/waving.fbx', function ( wavingObject ) {

        maleWaveAction = maleMixer.clipAction(wavingObject.animations[0])
        maleWaveAction.timeScale = 5

    })


} );


//const cameraControls = new OrbitControls(camera, canvas)

const clock = new Clock()
let ticks: number = 0

let cronWaveFemaleInterval: number = 10
let lastcronFemaleTick: number = 0
let lastcronMaleTick: number = 0

renderer.setAnimationLoop(function () {

    ticks = (clock.getDelta() * 1000) + ticks

    //cameraControls.update(clock.getDelta())

    renderer.render( scene, camera );

    pointLight.position.set(0, (Math.sin(ticks / 1000) * 5) + 15, 0)

    if (loadingFemaleDone) {
        femaleMixer.update(clock.getDelta())
    }
    if (loadingMaleDone) {
        maleMixer.update(clock.getDelta())
    }

    /*
    if (ticks > (lastcronFemaleTick + (cronWaveFemaleInterval * 1000))) {

        femaleWaveAction.play()
        lastcronFemaleTick = ticks

    }

    if (ticks > (lastcronMaleTick + ((cronWaveFemaleInterval + 5) * 1000))) {

        maleWaveAction.play()
        lastcronMaleTick = ticks

    }
    */

    scene.rotation.y = (Math.sin(ticks / 30000) * (Math.PI*2))

    if (resizeRendererToDisplaySize(renderer)) {

        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()    
        renderTarget.setSize(canvas.clientWidth, canvas.clientHeight)

    }

})
