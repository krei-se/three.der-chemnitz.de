import './style.css'

import {
    Clock,
    InstancedMesh,
    Scene
  } from 'three'
  
// GLOBALS
import Chemnitz from './Chemnitz/Chemnitz.ts'

import { FBXLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'

import { resizeRendererToDisplaySize } from './helpers/responsiveness'

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'

import { AmbientLight, AnimationAction, AnimationClip, AnimationMixer, BackSide, Group, CircleGeometry, Clock, Color, Fog, HemisphereLight, Mesh, MeshDepthMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, Scene, ShaderMaterial, SphereGeometry, TextureLoader, Vector3, WebGLRenderTarget, WebGLRenderer, GridHelper, Box3, Object3D, Box3Helper, Raycaster, Vector2, BoxHelper, AxesHelper, ArrowHelper, Quaternion, MeshPhysicalMaterial } from 'three'

import { getPageOverlayDiv, getOSMOverlayDiv, getGenesisDiv, getCCOverlayDiv, getKreiseOverlayDiv, getMailOverlayDiv, getDCOverlayDiv, getGenesisInfoDiv } from './htmlincludes'
import Dirigierstab from './Chemnitz/Dirigierstab.ts'
import ChemnitzOSM from './Chemnitz/ChemnitzOSM.ts'
import StoneForest from './Chemnitz/StoneForest.ts'
import DerChemnitz from './Chemnitz/DerChemnitz.ts'


const chemnitz = new Chemnitz()
chemnitz.camera.fov = 90


const removeMeDiv: HTMLDivElement = document.querySelector('#removeMe') ?? document.createElement('div')
document.body.removeChild(removeMeDiv)

let pageOverlayDiv: HTMLDivElement = getPageOverlayDiv()

document.body.append(pageOverlayDiv)

document.body.append(getOSMOverlayDiv())
document.body.append(getCCOverlayDiv())
document.body.append(getDCOverlayDiv())
document.body.append(getKreiseOverlayDiv())

let mailinfoDiv = getMailOverlayDiv()
let genesisInfoDiv = getGenesisInfoDiv()

document.body.append(mailinfoDiv)
document.body.append(genesisInfoDiv)


// end of HTML, consider use of KreiseClient

chemnitz.makeMainScene()

let mode = 'orbit'

chemnitz.camera.position.set(3, 2, 3)


// const ambientLight = new AmbientLight(new Color('white'), 1)
const pointLight = new PointLight(new Color('white'), 10, 50, 1)


if (chemnitz.brightness === 0) {
    pointLight.intensity = 10

    

}


if (chemnitz.brightness === 0) {
    chemnitz.camera.position.set(3, 2, 3)
    chemnitz.camera.lookAt(0, -2, 0)
}

pointLight.position.set(2, 2, 0)

chemnitz.scene.add(pointLight)

let derChemnitz: DerChemnitz

if (chemnitz.brightness === 0)
    derChemnitz = new DerChemnitz(chemnitz, 'Sleeping')

else
    derChemnitz = new DerChemnitz(chemnitz, 'Idle')




const gltfloader = new GLTFLoader()

gltfloader.load('models/german_post_box.glb', function (postbox) {

    let postboxModel = postbox.scene

    postboxModel.name = 'postbox'
    postboxModel.position.set(1,0,-.05)
    postboxModel.rotateY(Math.PI * .8)
    postboxModel.scale.set (0.01, 0.01, 0.01)

    chemnitz.scene.add(postboxModel)
    

    const postboxHelper: BoxHelper = new BoxHelper(postboxModel, 'orange')
    postboxHelper.name = 'postboxHelper'
    postboxHelper.layers.set(1)

    chemnitz.scene.add(postboxHelper)

    const postboxSelectedBox: BoxHelper = new BoxHelper(postboxModel, 'orange')
    postboxSelectedBox.name = 'postboxSelectedBox'
    postboxSelectedBox.layers.set(0)
    postboxSelectedBox.visible = false

    chemnitz.scene.add(postboxSelectedBox)

})

gltfloader.load('models/mfp_office_printer.glb', function (printer) {

    let printerModel = printer.scene

    printerModel.name = 'printer'
    printerModel.position.set(1,0.2,-0.8)
    printerModel.rotateY(-Math.PI * .2)
    printerModel.scale.set (0.005, 0.005, 0.005)

    if (chemnitz.brightness === 255) {
        chemnitz.scene.add(printerModel)
    }

    const printerHelper: BoxHelper = new BoxHelper(printerModel, 'blue')
    printerHelper.name = 'printerHelper'
    printerHelper.layers.set(1)
    chemnitz.scene.add(printerHelper)

    const printerSelectedBox: BoxHelper = new BoxHelper(printerModel, 'blue')
    printerSelectedBox.name = 'printerSelectedBox'
    printerSelectedBox.layers.set(0)
    printerSelectedBox.visible = false

    chemnitz.scene.add(printerSelectedBox)

})



let cameraControls: OrbitControls = new OrbitControls(chemnitz.camera, chemnitz.canvas)
cameraControls.target = new Vector3(0, 1, 0)
cameraControls.autoRotate = false
cameraControls.autoRotateSpeed = .4

if (chemnitz.brightness === 0) {
    cameraControls.target = new Vector3(0, 0, 0)
}

const clock = new Clock()

const stats: Stats = new Stats()
if (chemnitz.client.developerMode) {
  document.body.appendChild(stats.dom)
}



let ticks: number = 0

/*
if (import.meta.env.DEV) {

    const gridHelperInstance: GridHelper = new GridHelper(40, 40, 'orange', 'darkblue')
    gridHelperInstance.position.y = -0.02
    gridHelperInstance.visible = true
    chemnitz.scene.add(gridHelperInstance)

    const axesHelperInstance: AxesHelper = new AxesHelper(5)
    chemnitz.scene.add(axesHelperInstance)

}
*/

const raycaster: Raycaster = new Raycaster();
raycaster.layers.set (1)
const pointer = new Vector2(0.5,-0.8);
const pointerPx = new Vector2(0,0);


// arrowHelper.setDirection(raycaster.ray.direction)
// arrowHelper.position.set(raycaster.ray.origin.x, raycaster.ray.origin.y, raycaster.ray.origin.z)
// let arrowHelper = new ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff )
// scene.add(arrowHelper)

let idleTicks: number = 0

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.offsetX / window.innerWidth ) * 2 - 1; // from -1 to 1
	pointer.y = - ( event.offsetY / window.innerHeight ) * 2 + 1; // from -1 to 1

    pointerPx.x = event.offsetX
    pointerPx.y = event.offsetY

    // console.log(pointer)

    idleTicks = 0


}

window.addEventListener( 'pointermove', onPointerMove );

function onSelectedClick ( event ) {

    if (postboxSelected === true) {

        const email = 'post@der-chemnitz.de'; // Change this to your recipient email address
        const subject = 'Warum gehst Du nicht zu Onkel Werner?'; // Change this to your email subject
        const body = ''; // Change this to your email body
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        // window.location.href = mailtoUrl;

    }

    if (printerSelected === true && mode === 'orbit') {

        mode = 'genesis'
        chemnitz.camera.position.set(-2, 1, 1)
        cameraControls.target.set(0,0.5,0)
        cameraControls.autoRotate = false

        derChemnitz.maleAction.stop()
        derChemnitz.femaleAction.stop()

        document.body.append(chemnitz.genesis.genesisDiv)

        pageOverlayDiv.style.visibility = 'hidden'

        return

    }

    if (printerSelected === true && mode === 'genesis') {

        mode = 'orbit'
        chemnitz.camera.position.set(2, 1, 2)
        cameraControls.target = new Vector3(0, 1, 0)
        cameraControls.autoRotate = true


        derChemnitz.maleAction.play()
        derChemnitz.femaleAction.play()

        let genesisDiv = document.querySelector('#genesisDiv') ?? document.createElement('div')
        document.body.removeChild(genesisDiv)
    
        pageOverlayDiv.style.visibility = 'visible'        


        return

    }

}

window.addEventListener( 'click', onSelectedClick );


let chemnitzOSM = new ChemnitzOSM()
chemnitz.scene.add(chemnitzOSM.mesh)

let chemnitzSizeHelperBox = new Box3().setFromObject(chemnitzOSM.mesh)
let chemnitzSize = new Vector3()
chemnitzSizeHelperBox.getSize(chemnitzSize)

// let boundingSphereCityMap = chemnitzOSM.mesh.geometry.computeBoundingSphere()


//let chemnitzFluesseOSM = new ChemnitzFluesseOSM()
// chemnitzFluesseOSM.mesh.position.y = chemnitzFluesseOSM.mesh.position.y - 1 
// chemnitzFluesseOSM.mesh.position.x = chemnitzFluesseOSM.mesh.position.x - 6 

//scene.add(chemnitzFluesseOSM.mesh)

let delta: number = 0

let postboxSelected = false
let printerSelected = false

let pointLightCenter: PointLight = new PointLight(new Color('orange'), 100, chemnitzSize.x / 2, .3)
pointLightCenter.position.y = -chemnitzSize.y / 2

chemnitz.scene.add(pointLightCenter)

chemnitz.updateBrightness()

chemnitz.renderer.setAnimationLoop(function () {

    delta = clock.getDelta()

    ticks += (delta * 1000)
    idleTicks += (delta * 1000)

    cameraControls.update(delta)

    if (chemnitz.autoplay.animation) {
    
        chemnitz.stoneForest.update(ticks)
        chemnitz.stoneForest2.update(ticks)

        derChemnitz.update(ticks, delta)

        pointLight.position.set(2, (Math.sin(ticks / 1000) * 5) + 2, 2)

    }


    if (idleTicks > 30000) {

        cameraControls.autoRotate = true

    }

    else {

        cameraControls.autoRotate = false

    }
    
    if (chemnitz.client.developerMode) {
        stats.update()
        // add debug interfaces
      }

    chemnitz.composer.render();



    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, chemnitz.camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( chemnitz.scene.children );

    if (intersects.length != 0) {

        let postboxSelectedBox = chemnitz.scene.getObjectByName('postboxSelectedBox') ?? {}

            if (postboxSelectedBox.hasOwnProperty('visible')) {

                postboxSelectedBox.visible = false
            }
    
        let printerSelectedBox = chemnitz.scene.getObjectByName('printerSelectedBox') ?? {}

        if (printerSelectedBox.hasOwnProperty('visible')) {

            printerSelectedBox.visibility = 'hidden'

        }

        postboxSelected = false
        printerSelected = false

        mailinfoDiv.style.transition = 'opacity 10s'
        mailinfoDiv.style.opacity = '0'

        genesisInfoDiv.style.visibility = 'hidden'
        
        for ( let i = 0; i < intersects.length; i ++ ) {

            if (intersects[i].object.name === 'postboxHelper') {

                postboxSelected = true

                if (postboxSelectedBox.hasOwnProperty('visible')) {

                    postboxSelectedBox.visible = true


                }

                document.body.removeChild(mailinfoDiv)
//                mailinfoDiv.style.top = (pointerPx.y - 50).toString() + 'px'
//                mailinfoDiv.style.left = (pointerPx.x - 20).toString() + 'px'
                mailinfoDiv.style.visibility = 'visible'
                mailinfoDiv.style.opacity = '1'
                
                document.body.append(mailinfoDiv)

            }

            if (intersects[i].object.name === 'printerHelper') {

                printerSelected = true

                if (printerSelectedBox.hasOwnProperty('visible')) {

                    printerSelectedBox.visible = true

                }

                document.body.removeChild(genesisInfoDiv)
                genesisInfoDiv.style.top = (pointerPx.y - 50).toString() + 'px'
                genesisInfoDiv.style.left = (pointerPx.x + 20).toString() + 'px'
                genesisInfoDiv.style.visibility = 'visible'
                document.body.append(genesisInfoDiv)

            }



        }

    }

    else {

        mailinfoDiv.style.transition = 'opacity 10s'
        mailinfoDiv.style.opacity = '0'
        genesisInfoDiv.style.visibility = 'hidden'
        

        if (postboxSelected === true) {
            
            let postboxSelectedBox = chemnitz.scene.getObjectByName('postboxSelectedBox') ?? {}

            if (postboxSelectedBox.hasOwnProperty('visible')) {

                postboxSelectedBox.visible = false
            }
            
            postboxSelected = false

        }

        if (printerSelected === true) {
            

            let printerSelectedBox = chemnitz.scene.getObjectByName('printerSelectedBox') ?? {}

            if (printerSelectedBox.hasOwnProperty('visible')) {

                printerSelectedBox.visible = false

            }

            printerSelected = false

        }


    }

    //console.log(ticks)

    // console.log(camera.position)

    // scene.rotation.y = (Math.sin(ticks / 60000) * (Math.PI*2))


    chemnitz.graph.objects.dirigierStab.position.set(chemnitz.camera.position.x, chemnitz.camera.position.y, chemnitz.camera.position.z)
    
//    console.log(raycaster.ray.direction)

    // look direction (NOT the raycast but camera target)
    let lookDirection = new Vector3().subVectors(chemnitz.camera.position, cameraControls.target).normalize()

    let ratio = window.innerWidth / window.innerHeight

    var offset = new Vector3(pointer.x, pointer.y, 0.1); // Set z to 0 for 2D offset
    offset.applyQuaternion(chemnitz.graph.objects.dirigierStab.quaternion);

//    dirigierstab.position.add(offset.multiply(new Vector3(ratio, 1/ratio, 0.05)))
    chemnitz.graph.objects.dirigierStab.position.add(offset.multiply(new Vector3(ratio,1,1)))

    
    // let stabDesiredDirection = new Vector3().subVectors(dirigierstab.position, cameraControls.target).normalize()
    
    chemnitz.graph.objects.dirigierStab.lookAt(cameraControls.target)

    chemnitz.graph.objects.dirigierStab.position.subVectors(chemnitz.graph.objects.dirigierStab.position, lookDirection)

   if (resizeRendererToDisplaySize(chemnitz.renderer)) {

    chemnitz.updateCamera()

    chemnitz.composer.setSize(chemnitz.canvas.clientWidth, chemnitz.canvas.clientHeight)

    if (chemnitz.brightness === 0) {
      //chemnitz.composer.passes[1] = new UnrealBloomPass(new Vector2(chemnitz.canvas.clientWidth / 2, chemnitz.canvas.clientHeight / 2), 0.3, 0.05, 0)
    }

  }

})
