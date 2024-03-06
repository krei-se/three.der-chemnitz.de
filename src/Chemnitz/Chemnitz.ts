// this file extends and modifies most of the base Kreise.ts class

import Kreise, { AutoplayOptionsInterface, CameraType, DebugOptionsInterface, KreiseClient, ObjectType, ObjectRecordType } from "../Kreise/Kreise"


import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { Box3, PointLight, Scene, Vector3, WebGLRenderTarget, WebGLRenderer } from "three"

import ChemnitzOSM from "./ChemnitzOSM"
import StoneForest from './StoneForest'
import Dirigierstab from './Dirigierstab'
import KreiseZeit from "../Kreise/KreiseZeit"
import { EffectComposer } from "three/examples/jsm/Addons.js"

export default class Chemnitz extends Kreise {

  declare zeit: KreiseZeit
  declare suncalc: GetTimesResult
  declare sunPosition: GetSunPositionResult
  declare brightness: number

  declare canvas: HTMLCanvasElement
  declare renderer: WebGLRenderer
  declare renderTarget: WebGLRenderTarget
  declare composer: EffectComposer

  declare objects: ObjectRecordType
  declare scene: Scene
  declare camera: CameraType

  declare autoplay: AutoplayOptionsInterface
  declare debug: DebugOptionsInterface

  declare rhythms: any[]
  declare ColorScheme: string

  declare client: KreiseClient

  chemnitzOSM: ChemnitzOSM = new ChemnitzOSM()
  dirigierStab: Dirigierstab = new Dirigierstab()
  stoneForest: StoneForest = new StoneForest()

  

  constructor() {

    super()

    console.log('Chemnitz Constructor')
    this.chemnitzOSM = new ChemnitzOSM()
    console.log(this.chemnitzOSM)

  }

  
  makeMainScene(): void {

    console.log(this.chemnitzOSM)

    // get size of the main map
    this.objects.chemnitzSizeHelperBox = new Box3().setFromObject(this.chemnitzOSM.mesh)

    let chemnitzSize = new Vector3()
    this.objects.chemnitzSizeHelperBox.getSize(chemnitzSize) // unintuitive, it sets the size of the map into the vector

    

    // this.objects.ambientLight = new AmbientLight('white', 1)
    this.objects.pointLight = new PointLight('orange', 150, 150, 1.5)
    this.objects.pointLight.position.set(0, -chemnitzSize.x / 2, 0)
    
    this.scene.add(this.objects.pointLight)
    
    console.log(this.objects)

  }
  

}