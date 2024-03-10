import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters, InstancedMesh, TextureLoader, CylinderGeometry, SphereGeometry, MeshPhysicalMaterial } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'
import Chemnitz from "./Chemnitz";


export default class Dirigierstab {

    chemnitz: Chemnitz

    mesh: Group
    swirlPlaying: boolean = false

    oldTargets: Vector3[] = []

    constructor(chemnitz: Chemnitz) {


        
        const geometry = new CylinderGeometry( 0.002, 0.004, 0.4, 8, 7, true )

        geometry.groups = []
        // height
        for (let j: number = 0; j < 8; j++) {

            for (let i: number = 0; i < 7; i++) {
            
                geometry.addGroup((j * 7 * 6) + (i * 6), 6, 6 - i)
            }
        
        }

        const aquamarin = 0x77CCCC
        const erdbeerrot = 0xD14152
        const gelbgruen = 0x55AA33
        const himmelblau = 0x3077BB
        const melonengelb = 0xFFAA00
        const signalviolett = 0xCC00FF
        const verkehrsgelb = 0xF0C900

        const transparency = true
        const opacity = 0.6
        const shininess = 50
        const intensity = 1
        const metalness = 0.6
        const roughness = 0.3

        let materials: MeshPhysicalMaterial[] = []
        
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: aquamarin, emissive: aquamarin, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: erdbeerrot, emissive: erdbeerrot, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: gelbgruen, emissive: gelbgruen, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: himmelblau, emissive: himmelblau, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: melonengelb, emissive: melonengelb, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: signalviolett, emissive: signalviolett, emissiveIntensity: intensity }))
        materials.push(new MeshPhysicalMaterial({ metalness: metalness, roughness: roughness, transparent: transparency, opacity: opacity, color: verkehrsgelb, emissive: verkehrsgelb, emissiveIntensity: intensity }))
        
        let stab = new Mesh (geometry, materials)

        const baseGeometry = new SphereGeometry(0.02, 8, 8)
        const baseMaterial = new MeshPhongMaterial({ color: new Color('white')})

        let base = new Mesh (baseGeometry, baseMaterial)


        this.mesh = new Group()
        this.mesh.add(stab)
        this.mesh.add(base)

        stab.rotateX(Math.PI/2)

        base.position.z = 0
        stab.position.z = 0.02 + 0.2 // radius of sphere (why, should be double lol) plus half of cylinder
        

    }

    update()

    playSwirl(starttick) {

        

    }

}