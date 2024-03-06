// this class is a placeholder for the morphed human entity in city center

import { AnimationAction, AnimationMixer, Group, Mesh, MeshPhysicalMaterial, Object3D, PropertyMixer } from "three";
import Chemnitz from "./Chemnitz";
import { FBXLoader } from "three/examples/jsm/Addons.js";


export default class DerChemnitz {

  chemnitz: Chemnitz

  model: Mesh
  female: Group
  femaleChildren: any[]
  male: Group
  maleChildren: any[]

  loadingFemaleDone: boolean = false
  loadingFemaleWavingDone: boolean = false
  loadingMaleDone: boolean = false
  loadingMaleWavingDone: boolean = false

  animationActions: AnimationAction[] = []

  femaleMixer: AnimationMixer
  maleMixer: AnimationMixer

  femaleAction: AnimationAction
  maleAction: AnimationAction

  loadingFemaleDone: boolean = false
  loadingMaleDone: boolean = false
  
  constructor(chemnitz: Chemnitz, action: string = 'Idle') {

    this.chemnitz = chemnitz

    const loader = new FBXLoader();

    var self = this

    loader.load( 'models/' + action + '_female.fbx', (female) => {

      self.female = female
      self.female.name = "female"
      self.female.scale.set(0.01, 0.01, 0.01)
      self.female.position.set(0,0,0)
      self.female.rotateY(-Math.PI/3)
  
      self.femaleMixer = new AnimationMixer(self.female)
      self.femaleAction = self.femaleMixer.clipAction(self.female.animations[0])
  
      self.loadingFemaleDone = true
  
      // femaleAction.play()
      self.chemnitz.scene.add(female);
  
      // console.log(female)
    
    /*  self.femaleChildren[0] = female.getObjectByName('Beta_Surface')
      self.femaleChildren[1] = female.getObjectByName('Beta_Joints')
      self.femaleChildren[0].material = new MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.8 })
      self.femaleChildren[1].material = new MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.8 })
      */

      })

    

    loader.load( 'models/' + action + '_male.fbx', (male) => {

      this.male = male
      this.male.name = "male"
      this.male.scale.set(0.01, 0.01, 0.01)
      this.male.position.set(0,0,0)
      this.male.rotateY(-Math.PI/3)
  
      this.maleMixer = new AnimationMixer(this.male)
      this.maleAction = this.maleMixer.clipAction(this.male.animations[0])
      if (action === 'Sleeping') this.maleAction = this.maleMixer.clipAction(this.male.animations[1])
  
      this.loadingMaleDone = true
  
      // femaleAction.play()
      this.chemnitz.scene.add(male);
  
      // console.log(female)
      /*
      this.maleChildren[0] = this.male.getObjectByName('Alpha_Surface')
      this.maleChildren[1] = this.male.getObjectByName('Alpha_Joints')
      this.maleChildren[0].material = new MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.8 })
      this.maleChildren[1].material = new MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.8 })
      */
      })



  }

  switchAction(action: string = 'Idle') {



  }

  update(ticks) {

    

  }

}