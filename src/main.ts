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

if (chemnitz.brightness === 0) {
    chemnitz.camera.position.set(3, 2, 3)
    chemnitz.camera.lookAt(0, -2, 0)
}

let topColor: number = 0x9922dd
let bottomColor: number = 0xfcd3f4

if (chemnitz.brightness < 128) {
    topColor = 0x443399
    bottomColor = 0x442222
}


const vertexShader: string = ` 

varying vec3 vWorldPosition;

void main() {

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`;

const fragmentShader: string = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

}
`;

const hemiLight = new HemisphereLight( topColor, bottomColor, 1 );
hemiLight.position.set( 0, 60, 0 );

const uniforms = {
    'topColor': { value: new Color( topColor ) },
    'bottomColor': { value: new Color( bottomColor ) },
    'offset': { value: 50 },
    'exponent': { value: 0.7 }
};
uniforms[ 'topColor' ].value.copy( hemiLight.color );
uniforms[ 'bottomColor' ].value.copy( hemiLight.groundColor );


chemnitz.scene.background = new Color().setHSL( 0.6, 0, 1 );
chemnitz.scene.fog = new Fog( scene.background, 1, 5000 );

chemnitz.scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

const skyGeo = new SphereGeometry( 4000, 32, 15 );
const skyMat = new ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: BackSide
} );

const sky = new Mesh( skyGeo, skyMat );
chemnitz.scene.add( sky );


// const ambientLight = new AmbientLight(new Color('white'), 1)
const pointLight = new PointLight(new Color('white'), 10, 50, 1)


if (chemnitz.brightness === 0) {
    pointLight.intensity = 10

    

}

pointLight.position.set(2, 2, 0)

chemnitz.scene.add(hemiLight)
// chemnitz.scene.add(ambientLight)
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
if (import.meta.env.DEV) {
  document.body.appendChild(stats.dom)
}



let ticks: number = 0

let cronWaveFemaleInterval: number = 10
let lastcronFemaleTick: number = 0
let lastcronMaleTick: number = 0

let colorMap = []
colorMap[0] = [0x681DF5, 0x1DF5BC, 0xF5501D, 0xF5E91D, 0xA36654, 0x584975]
colorMap[1] = [0xE31DF5, 0x1DB3F5, 0xF5911D, 0x7FF51D, 0xA37F55, 0x796E7A]

let turbo_colormap_data = [[0.18995,0.07176,0.23217],[0.19483,0.08339,0.26149],[0.19956,0.09498,0.29024],[0.20415,0.10652,0.31844],[0.20860,0.11802,0.34607],[0.21291,0.12947,0.37314],[0.21708,0.14087,0.39964],[0.22111,0.15223,0.42558],[0.22500,0.16354,0.45096],[0.22875,0.17481,0.47578],[0.23236,0.18603,0.50004],[0.23582,0.19720,0.52373],[0.23915,0.20833,0.54686],[0.24234,0.21941,0.56942],[0.24539,0.23044,0.59142],[0.24830,0.24143,0.61286],[0.25107,0.25237,0.63374],[0.25369,0.26327,0.65406],[0.25618,0.27412,0.67381],[0.25853,0.28492,0.69300],[0.26074,0.29568,0.71162],[0.26280,0.30639,0.72968],[0.26473,0.31706,0.74718],[0.26652,0.32768,0.76412],[0.26816,0.33825,0.78050],[0.26967,0.34878,0.79631],[0.27103,0.35926,0.81156],[0.27226,0.36970,0.82624],[0.27334,0.38008,0.84037],[0.27429,0.39043,0.85393],[0.27509,0.40072,0.86692],[0.27576,0.41097,0.87936],[0.27628,0.42118,0.89123],[0.27667,0.43134,0.90254],[0.27691,0.44145,0.91328],[0.27701,0.45152,0.92347],[0.27698,0.46153,0.93309],[0.27680,0.47151,0.94214],[0.27648,0.48144,0.95064],[0.27603,0.49132,0.95857],[0.27543,0.50115,0.96594],[0.27469,0.51094,0.97275],[0.27381,0.52069,0.97899],[0.27273,0.53040,0.98461],[0.27106,0.54015,0.98930],[0.26878,0.54995,0.99303],[0.26592,0.55979,0.99583],[0.26252,0.56967,0.99773],[0.25862,0.57958,0.99876],[0.25425,0.58950,0.99896],[0.24946,0.59943,0.99835],[0.24427,0.60937,0.99697],[0.23874,0.61931,0.99485],[0.23288,0.62923,0.99202],[0.22676,0.63913,0.98851],[0.22039,0.64901,0.98436],[0.21382,0.65886,0.97959],[0.20708,0.66866,0.97423],[0.20021,0.67842,0.96833],[0.19326,0.68812,0.96190],[0.18625,0.69775,0.95498],[0.17923,0.70732,0.94761],[0.17223,0.71680,0.93981],[0.16529,0.72620,0.93161],[0.15844,0.73551,0.92305],[0.15173,0.74472,0.91416],[0.14519,0.75381,0.90496],[0.13886,0.76279,0.89550],[0.13278,0.77165,0.88580],[0.12698,0.78037,0.87590],[0.12151,0.78896,0.86581],[0.11639,0.79740,0.85559],[0.11167,0.80569,0.84525],[0.10738,0.81381,0.83484],[0.10357,0.82177,0.82437],[0.10026,0.82955,0.81389],[0.09750,0.83714,0.80342],[0.09532,0.84455,0.79299],[0.09377,0.85175,0.78264],[0.09287,0.85875,0.77240],[0.09267,0.86554,0.76230],[0.09320,0.87211,0.75237],[0.09451,0.87844,0.74265],[0.09662,0.88454,0.73316],[0.09958,0.89040,0.72393],[0.10342,0.89600,0.71500],[0.10815,0.90142,0.70599],[0.11374,0.90673,0.69651],[0.12014,0.91193,0.68660],[0.12733,0.91701,0.67627],[0.13526,0.92197,0.66556],[0.14391,0.92680,0.65448],[0.15323,0.93151,0.64308],[0.16319,0.93609,0.63137],[0.17377,0.94053,0.61938],[0.18491,0.94484,0.60713],[0.19659,0.94901,0.59466],[0.20877,0.95304,0.58199],[0.22142,0.95692,0.56914],[0.23449,0.96065,0.55614],[0.24797,0.96423,0.54303],[0.26180,0.96765,0.52981],[0.27597,0.97092,0.51653],[0.29042,0.97403,0.50321],[0.30513,0.97697,0.48987],[0.32006,0.97974,0.47654],[0.33517,0.98234,0.46325],[0.35043,0.98477,0.45002],[0.36581,0.98702,0.43688],[0.38127,0.98909,0.42386],[0.39678,0.99098,0.41098],[0.41229,0.99268,0.39826],[0.42778,0.99419,0.38575],[0.44321,0.99551,0.37345],[0.45854,0.99663,0.36140],[0.47375,0.99755,0.34963],[0.48879,0.99828,0.33816],[0.50362,0.99879,0.32701],[0.51822,0.99910,0.31622],[0.53255,0.99919,0.30581],[0.54658,0.99907,0.29581],[0.56026,0.99873,0.28623],[0.57357,0.99817,0.27712],[0.58646,0.99739,0.26849],[0.59891,0.99638,0.26038],[0.61088,0.99514,0.25280],[0.62233,0.99366,0.24579],[0.63323,0.99195,0.23937],[0.64362,0.98999,0.23356],[0.65394,0.98775,0.22835],[0.66428,0.98524,0.22370],[0.67462,0.98246,0.21960],[0.68494,0.97941,0.21602],[0.69525,0.97610,0.21294],[0.70553,0.97255,0.21032],[0.71577,0.96875,0.20815],[0.72596,0.96470,0.20640],[0.73610,0.96043,0.20504],[0.74617,0.95593,0.20406],[0.75617,0.95121,0.20343],[0.76608,0.94627,0.20311],[0.77591,0.94113,0.20310],[0.78563,0.93579,0.20336],[0.79524,0.93025,0.20386],[0.80473,0.92452,0.20459],[0.81410,0.91861,0.20552],[0.82333,0.91253,0.20663],[0.83241,0.90627,0.20788],[0.84133,0.89986,0.20926],[0.85010,0.89328,0.21074],[0.85868,0.88655,0.21230],[0.86709,0.87968,0.21391],[0.87530,0.87267,0.21555],[0.88331,0.86553,0.21719],[0.89112,0.85826,0.21880],[0.89870,0.85087,0.22038],[0.90605,0.84337,0.22188],[0.91317,0.83576,0.22328],[0.92004,0.82806,0.22456],[0.92666,0.82025,0.22570],[0.93301,0.81236,0.22667],[0.93909,0.80439,0.22744],[0.94489,0.79634,0.22800],[0.95039,0.78823,0.22831],[0.95560,0.78005,0.22836],[0.96049,0.77181,0.22811],[0.96507,0.76352,0.22754],[0.96931,0.75519,0.22663],[0.97323,0.74682,0.22536],[0.97679,0.73842,0.22369],[0.98000,0.73000,0.22161],[0.98289,0.72140,0.21918],[0.98549,0.71250,0.21650],[0.98781,0.70330,0.21358],[0.98986,0.69382,0.21043],[0.99163,0.68408,0.20706],[0.99314,0.67408,0.20348],[0.99438,0.66386,0.19971],[0.99535,0.65341,0.19577],[0.99607,0.64277,0.19165],[0.99654,0.63193,0.18738],[0.99675,0.62093,0.18297],[0.99672,0.60977,0.17842],[0.99644,0.59846,0.17376],[0.99593,0.58703,0.16899],[0.99517,0.57549,0.16412],[0.99419,0.56386,0.15918],[0.99297,0.55214,0.15417],[0.99153,0.54036,0.14910],[0.98987,0.52854,0.14398],[0.98799,0.51667,0.13883],[0.98590,0.50479,0.13367],[0.98360,0.49291,0.12849],[0.98108,0.48104,0.12332],[0.97837,0.46920,0.11817],[0.97545,0.45740,0.11305],[0.97234,0.44565,0.10797],[0.96904,0.43399,0.10294],[0.96555,0.42241,0.09798],[0.96187,0.41093,0.09310],[0.95801,0.39958,0.08831],[0.95398,0.38836,0.08362],[0.94977,0.37729,0.07905],[0.94538,0.36638,0.07461],[0.94084,0.35566,0.07031],[0.93612,0.34513,0.06616],[0.93125,0.33482,0.06218],[0.92623,0.32473,0.05837],[0.92105,0.31489,0.05475],[0.91572,0.30530,0.05134],[0.91024,0.29599,0.04814],[0.90463,0.28696,0.04516],[0.89888,0.27824,0.04243],[0.89298,0.26981,0.03993],[0.88691,0.26152,0.03753],[0.88066,0.25334,0.03521],[0.87422,0.24526,0.03297],[0.86760,0.23730,0.03082],[0.86079,0.22945,0.02875],[0.85380,0.22170,0.02677],[0.84662,0.21407,0.02487],[0.83926,0.20654,0.02305],[0.83172,0.19912,0.02131],[0.82399,0.19182,0.01966],[0.81608,0.18462,0.01809],[0.80799,0.17753,0.01660],[0.79971,0.17055,0.01520],[0.79125,0.16368,0.01387],[0.78260,0.15693,0.01264],[0.77377,0.15028,0.01148],[0.76476,0.14374,0.01041],[0.75556,0.13731,0.00942],[0.74617,0.13098,0.00851],[0.73661,0.12477,0.00769],[0.72686,0.11867,0.00695],[0.71692,0.11268,0.00629],[0.70680,0.10680,0.00571],[0.69650,0.10102,0.00522],[0.68602,0.09536,0.00481],[0.67535,0.08980,0.00449],[0.66449,0.08436,0.00424],[0.65345,0.07902,0.00408],[0.64223,0.07380,0.00401],[0.63082,0.06868,0.00401],[0.61923,0.06367,0.00410],[0.60746,0.05878,0.00427],[0.59550,0.05399,0.00453],[0.58336,0.04931,0.00486],[0.57103,0.04474,0.00529],[0.55852,0.04028,0.00579],[0.54583,0.03593,0.00638],[0.53295,0.03169,0.00705],[0.51989,0.02756,0.00780],[0.50664,0.02354,0.00863],[0.49321,0.01963,0.00955],[0.47960,0.01583,0.01055]]


let jointColor = new Color()
let bodyColor = new Color()

let turboColorIndex = 10
let turboColorBodyIndex = 180
let shininess = 400

let lastColorChangeTick = 0


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


let dirigierstab = new Dirigierstab().mesh
dirigierstab.position.set (-1,0,0)

chemnitz.scene.add(dirigierstab)

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

        document.body.append(getGenesisDiv())

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

let stoneForest = new StoneForest(chemnitzSize.x * .90)
let stoneForest2 = new StoneForest(chemnitzSize.x * .90)

let stoneForestCurveMesh = stoneForest.curveMesh

stoneForestCurveMesh.rotateX(Math.PI/2)
stoneForestCurveMesh.position.y = -chemnitzSize.x / 2

// chemnitz.scene.add(stoneForestCurveMesh)

let stoneForestMesh1: InstancedMesh = stoneForest.mesh1
stoneForestMesh1.rotateX(Math.PI/2)
stoneForestMesh1.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForestMesh1)

let stoneForestMesh2: InstancedMesh = stoneForest.mesh2
stoneForestMesh2.rotateX(Math.PI/2)
stoneForestMesh2.rotateZ(Math.PI * 2 / 3)

stoneForestMesh2.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForestMesh2)

let stoneForestMesh3: InstancedMesh = stoneForest.mesh3
stoneForestMesh3.rotateX(Math.PI/2)
stoneForestMesh3.rotateZ(Math.PI * 4 /3)
stoneForestMesh3.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForestMesh3)

let stoneForest2Mesh1: InstancedMesh = stoneForest2.mesh1
stoneForest2Mesh1.rotateX(Math.PI/2)
stoneForest2Mesh1.rotateZ(Math.PI)
stoneForest2Mesh1.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForest2Mesh1)

let stoneForest2Mesh2: InstancedMesh = stoneForest2.mesh2
stoneForest2Mesh2.rotateX(Math.PI/2)
stoneForest2Mesh2.rotateZ(Math.PI * 1 / 3)

stoneForest2Mesh2.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForest2Mesh2)

let stoneForest2Mesh3: InstancedMesh = stoneForest2.mesh3
stoneForest2Mesh3.rotateX(Math.PI/2)
stoneForest2Mesh3.rotateZ(Math.PI * 5 / 3)
stoneForest2Mesh3.position.y = -chemnitzSize.x / 2

chemnitz.scene.add(stoneForest2Mesh3)

//let chemnitzFluesseOSM = new ChemnitzFluesseOSM()
// chemnitzFluesseOSM.mesh.position.y = chemnitzFluesseOSM.mesh.position.y - 1 
// chemnitzFluesseOSM.mesh.position.x = chemnitzFluesseOSM.mesh.position.x - 6 

//scene.add(chemnitzFluesseOSM.mesh)

let delta: number = 0

let animationSynced = false
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

    stoneForest.update(ticks)
    stoneForest2.update(ticks)

    if (idleTicks > 5000) {

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

    if (derChemnitz.loadingFemaleDone && derChemnitz.loadingMaleDone && animationSynced === false) {
        derChemnitz.maleAction.play()
        derChemnitz.femaleAction.play()
        animationSynced = true
    }

    pointLight.position.set(2, (Math.sin(ticks / 1000) * 5) + 2, 2)

    if (ticks > (lastColorChangeTick + 200)) {

        turboColorIndex = turboColorIndex + (Math.floor(Math.random() * 5))
        turboColorBodyIndex = turboColorBodyIndex + (Math.floor(Math.random() * 2))
        shininess = shininess + (Math.floor(Math.random() * 20))
        if (turboColorIndex > 255) turboColorIndex = turboColorIndex - 255
        if (turboColorBodyIndex > 255) turboColorBodyIndex = turboColorBodyIndex - 255
        if (shininess > 1000) shininess = 50



        jointColor.r = turbo_colormap_data[turboColorIndex][0] - .2
        jointColor.g = turbo_colormap_data[turboColorIndex][1] - .1
        jointColor.b = turbo_colormap_data[turboColorIndex][2] - .2
        
        bodyColor.r = turbo_colormap_data[turboColorBodyIndex][0] - .4
        bodyColor.g = turbo_colormap_data[turboColorBodyIndex][1] - .5
        bodyColor.b = turbo_colormap_data[turboColorBodyIndex][2] - .4
        
        if (derChemnitz.loadingFemaleDone) {

            let female = chemnitz.scene.getObjectByName('female')

            let children = []

            children[0] = female.getObjectByName('Beta_Surface')
            children[1] = female.getObjectByName('Beta_Joints')
            children[0].material.color = bodyColor
            children[1].material.color = jointColor
            children[0].material.roughness = Math.sin(ticks / 5000)
            children[1].material.roughness = Math.sin(ticks / 5000)
            
            children[0].material.needsUpdate = true
            children[1].material.needsUpdate = true

        }

        if (derChemnitz.loadingMaleDone) {

            let male = chemnitz.scene.getObjectByName('male')

            let children = []

            children[0] = male.getObjectByName('Alpha_Surface')
            children[1] = male.getObjectByName('Alpha_Joints')
            children[0].material.color = bodyColor
            children[1].material.color = jointColor
            children[0].material.roughness = Math.sin(ticks / 5000)
            children[1].material.roughness = Math.sin(ticks / 5000)

            children[0].material.needsUpdate = true
            children[1].material.needsUpdate = true

        }

        

        lastColorChangeTick = ticks

    }

    if (derChemnitz.loadingFemaleDone) {
        derChemnitz.femaleMixer.update(delta)
        let female = chemnitz.scene.getObjectByName('female')
        
        let children = []

        children[0] = female.getObjectByName('Beta_Surface')
        children[1] = female.getObjectByName('Beta_Joints')
        // console.log(children)
        children[0].material.transparent = true
        children[1].material.transparent = true
        children[1].shininess = shininess

        children[0].material.opacity = Math.sin(ticks / 2000) + .5
        children[1].material.opacity = Math.sin(ticks / 2000) + .3


        if (Math.sin(ticks / 2000) < 0) {
            female.visible = false
        }
        else {
            female.visible = true
        }
        /*
        if (Math.sin(ticks / 2000) < 0.2) {
            children[0].material.wireframe = true
        }
        else {
            children[0].material.wireframe = false
        }
        */
        children[0].material.needsUpdate = true
        children[1].material.needsUpdate = true
        
        // console.log (children)

    }
    if (derChemnitz.loadingMaleDone) {
        derChemnitz.maleMixer.update(delta)
        let male = chemnitz.scene.getObjectByName('male')

        let children = []
        children[0] = male.getObjectByName('Alpha_Surface')
        children[1] = male.getObjectByName('Alpha_Joints')
        children[0].material.transparent = true
        children[1].material.transparent = true
        children[1].shininess = shininess

        children[0].material.opacity = Math.sin(ticks / -2000) + .5
        children[1].material.opacity = Math.sin(ticks / -2000) + .3


        if (Math.sin(ticks / -2000) < 0) {
            male.visible = false
        }
        else {
            male.visible = true
        }
        /*
        if (Math.sin(ticks / -2000) < 0.2) {
            children[0].material.wireframe = true
        }
        else {
            children[0].material.wireframe = false
        }
        */
        children[0].material.needsUpdate = true
        children[1].material.needsUpdate = true


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


    dirigierstab.position.set(chemnitz.camera.position.x, chemnitz.camera.position.y, chemnitz.camera.position.z)
    
//    console.log(raycaster.ray.direction)

    // look direction (NOT the raycast but camera target)
    let lookDirection = new Vector3().subVectors(chemnitz.camera.position, cameraControls.target).normalize()


    let ratio = window.innerWidth / window.innerHeight

    var offset = new Vector3(pointer.x, pointer.y, 0); // Set z to 0 for 2D offset
    offset.applyQuaternion(dirigierstab.quaternion);

//    dirigierstab.position.add(offset.multiply(new Vector3(ratio, 1/ratio, 0.05)))
    dirigierstab.position.add(offset.multiply(new Vector3(ratio,1,1)))

    
    // let stabDesiredDirection = new Vector3().subVectors(dirigierstab.position, cameraControls.target).normalize()
    
    dirigierstab.lookAt(cameraControls.target)

  //  console.log(dirigierstab.rotation)


   dirigierstab.position.subVectors(dirigierstab.position, lookDirection)



   if (resizeRendererToDisplaySize(chemnitz.renderer)) {

    chemnitz.updateCamera()

    chemnitz.composer.setSize(chemnitz.canvas.clientWidth, chemnitz.canvas.clientHeight)

    if (chemnitz.brightness === 0) {
      //chemnitz.composer.passes[1] = new UnrealBloomPass(new Vector2(chemnitz.canvas.clientWidth / 2, chemnitz.canvas.clientHeight / 2), 0.3, 0.05, 0)
    }
  }

})
