// this file extends and modifies most of the base Kreise.ts class

import Kreise, { AutoplayOptionsInterface, CameraType, DebugOptionsInterface, KreiseClient } from "../Kreise/Kreise"


// import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { BackSide, Box3, Box3Helper, Color, DirectionalLight, DirectionalLightHelper, Fog, HemisphereLight, Mesh, PointLight, Scene, ShaderMaterial, SphereGeometry, Vector3, WebGLRenderTarget, WebGLRenderer } from "three"

import ChemnitzOSM from "./ChemnitzOSM"
import StoneForest from './StoneForest'
import Dirigierstab from './Dirigierstab'
import KreiseZeit from "../Kreise/KreiseZeit"
import { EffectComposer } from "three/examples/jsm/Addons.js"
import Genesis from "./Genesis"
import KreiseGraph from "../Kreise/KreiseGraph"
import GenesisMap from "./GenesisMap"

export default class Chemnitz extends Kreise {

  declare zeit: KreiseZeit
  declare location: number[]
  declare suncalc: GetTimesResult
  declare sunPosition: GetSunPositionResult
  declare brightness: number

  declare canvas: HTMLCanvasElement
  declare renderer: WebGLRenderer
  declare renderTarget: WebGLRenderTarget
  declare composer: EffectComposer

  // Graph
  declare graph: KreiseGraph
  // World Matrix
  declare scene: Scene
  // View Matrix
  declare camera: CameraType

  declare autoplay: AutoplayOptionsInterface
  declare debug: DebugOptionsInterface

  declare rhythms: any[]
  declare ColorScheme: string

  declare client: KreiseClient

  chemnitzOSM: ChemnitzOSM = new ChemnitzOSM()
  dirigierStab: Dirigierstab = new Dirigierstab(this)
  stoneForest: StoneForest = new StoneForest()
  stoneForest2: StoneForest = new StoneForest()
  
  genesis: Genesis = new Genesis(GenesisMap.levels.cyborg)

  constructor() {

    super()
    // set location for brightness calculation
    this.location = [12.919292512170788, 50.832438133484864]

    console.log('Chemnitz Constructor')

    this.makeHemisphere()

    // Genesis Lifeform Creator customization
    this.genesis.debugMode = this.client.developerMode

  }

  updateBrightness(brightness: number = NaN): void {
    
    super.updateBrightness(brightness)

    console.log(this.brightness)

    // this.objects.sunLight.position 

  }
  
  async makeMainScene(): Promise<void> {

    // load main map
    this.graph.objects.chemnitzOSM = this.chemnitzOSM.mesh
    this.scene.add(this.graph.objects.chemnitzOSM)

    // get size of the main map
    this.graph.objects.chemnitzSizeBox = new Box3().setFromObject(this.chemnitzOSM.mesh)

    let chemnitzSize = new Vector3()
    this.graph.objects.chemnitzSizeBox.getSize(chemnitzSize) // unintuitive, it sets the size of the map into the vector
    


    this.graph.helpers.chemnitzSizeBoxHelper = new Box3Helper(this.graph.objects.chemnitzSizeBox)
    this.graph.helpers.chemnitzSizeBoxHelper.userData.isDebugHelper = true
    this.graph.helpers.chemnitzSizeBoxHelper.visible = false
    
    this.scene.add(this.graph.helpers.chemnitzSizeBoxHelper)

    // this.graph.lights.ambientLight = new AmbientLight('white', 1)

    this.graph.lights.pointLightCenter = new PointLight(new Color('orange'), 150, chemnitzSize.x / 2, 0.8)
    this.graph.lights.pointLightCenter.position.y = -chemnitzSize.y / 2
    
    this.scene.add(this.graph.lights.pointLightCenter)
    



    this.graph.objects.dirigierStab = this.dirigierStab.mesh

    this.scene.add(this.graph.objects.dirigierStab)


    this.stoneForest = new StoneForest(chemnitzSize.x * 0.70)
    this.stoneForest2 = new StoneForest(chemnitzSize.x * 0.70)

    this.stoneForest.load().then(() => {

      console.log(this.stoneForest)
        
      this.graph.helpers.stoneForestCurveMeshHelper = this.stoneForest.curveMesh
      this.graph.helpers.stoneForestCurveMeshHelper.rotateX(Math.PI/2)
      this.graph.helpers.stoneForestCurveMeshHelper.position.y = -chemnitzSize.x / 2
      this.graph.helpers.stoneForestCurveMeshHelper.userData.isDebugHelper = true
      this.graph.helpers.stoneForestCurveMeshHelper.visible = false
      
      this.scene.add(this.graph.helpers.stoneForestCurveMeshHelper)
      
      this.graph.objects.stoneForestMesh1 = this.stoneForest.mesh1
      this.graph.objects.stoneForestMesh1.position.y = -chemnitzSize.x / 2
      
      
      this.scene.add(this.graph.objects.stoneForestMesh1)
      
      this.graph.objects.stoneForestMesh2 = this.stoneForest.mesh2
      this.graph.objects.stoneForestMesh2.position.y = -chemnitzSize.x / 2
      
      this.scene.add(this.graph.objects.stoneForestMesh2)
      
      this.graph.objects.stoneForestMesh3 = this.stoneForest.mesh3
      this.graph.objects.stoneForestMesh3.position.y = -chemnitzSize.x / 2
      
      this.scene.add(this.graph.objects.stoneForestMesh3)

      })
    
    this.stoneForest2.load().then(() => {

      this.graph.objects.stoneForest2Mesh1 = this.stoneForest2.mesh1
      this.graph.objects.stoneForest2Mesh1.rotateZ(Math.PI * 1 / 3)
      this.graph.objects.stoneForest2Mesh1.position.y = -chemnitzSize.x / 2
      
      this.scene.add(this.graph.objects.stoneForest2Mesh1)
      
      this.graph.objects.stoneForest2Mesh2 = this.stoneForest2.mesh2
      this.graph.objects.stoneForest2Mesh2.rotateZ(Math.PI * 1 / 3)
      
      this.graph.objects.stoneForest2Mesh2.position.y = -chemnitzSize.x / 2
      
      this.scene.add(this.graph.objects.stoneForest2Mesh2)
      
      this.graph.objects.stoneForest2Mesh3 = this.stoneForest2.mesh3
      this.graph.objects.stoneForest2Mesh3.rotateZ(Math.PI * 1 / 3)
      this.graph.objects.stoneForest2Mesh3.position.y = -chemnitzSize.x / 2
      
      this.scene.add(this.graph.objects.stoneForest2Mesh3)

    })
  
  }


  makeHemisphere(size: number = 4000): void {

    console.log(this.sunPosition)

    this.graph.lights.sunLight = new DirectionalLight('white')

    // -z is north

    // sunPosition.azimuth: 0: S PI/2: W PI: N PI*1.5: E
    // @MIGRATE this will always have to be converted to East and counterclockwise, no matter the implementation.
    //               CCW         S -> N     N -> E                               mod for tidy up
    let azimuth = Math.PI*2 - ((Math.PI + Math.PI/2 + this.sunPosition.azimuth) % Math.PI*2)
    let altitude = this.sunPosition.altitude  
  
    let x = Math.cos(altitude) * Math.cos(azimuth) * size
    let y = Math.sin(altitude) * Math.sin(azimuth) * size
    let z = Math.cos(altitude) * Math.sin(azimuth) * size

    this.graph.lights.sunLight.position.set(x,y,z)
    // target is 0,0,0 default and needs to be an object added in the scene. to change .target = Object3D


    this.graph.helpers.sunLightHelper = new DirectionalLightHelper(this.graph.lights.sunLight as DirectionalLight)
    this.graph.helpers.sunLightHelper.userData.isDebugHelper = true
    this.graph.helpers.sunLightHelper.visible = false

    this.scene.add(this.graph.lights.sunLight)
    this.scene.add(this.graph.helpers.sunLightHelper)

    let topColor: number = 0x008dcd
    let bottomColor: number = 0x008259
    
    if (this.brightness < 128) {
        topColor = 0x443399
        bottomColor = 0x442222
    }
    
    this.graph.lights.hemiLight = new HemisphereLight( topColor, bottomColor, 1 );
    this.graph.lights.hemiLight.position.set( 0, 0, 0 );
    
    const uniforms = {
        'topColor': { value: new Color( topColor ) },
        'bottomColor': { value: new Color( bottomColor ) },
        'offset': { value: 50 },
        'exponent': { value: 0.7 }
    };
    uniforms[ 'topColor' ].value.copy( this.graph.lights.hemiLight.color );
    uniforms[ 'bottomColor' ].value.copy( this.graph.lights.hemiLight.groundColor );
    
    
    this.scene.background = new Color().setHSL(0.6, 0, 1)
    this.graph.objects.fog = new Fog(this.scene.background as Color, 1, size * 1.25)
    
    this.graph.objects.fog.color.copy(uniforms[ 'bottomColor' ].value)
    
    const skyGeo = new SphereGeometry(size, 32, 15)
    
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
  

    const skyMat = new ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: BackSide
    } );
    
    this.graph.objects.sky = new Mesh( skyGeo, skyMat );

    

    this.scene.add(this.graph.objects.sky);

    this.scene.add(this.graph.lights.hemiLight)
  

  }
  

}