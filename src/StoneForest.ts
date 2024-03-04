import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters, InstancedMesh, TextureLoader, CylinderGeometry } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

import stonewall1Image from './textures/stonewall1.png'
import stonewall2Image from './textures/stonewall2.png'
import stonewall3Image from './textures/stonewall3.png'

export default class StoneForest {

    size: number = 500 // for the whole globe
    innerRadius: number = 20
    outerRadius: number = this.size - this.innerRadius - 10
    instances: number = 200
    curve: CatmullRomCurve3
    curveMesh: Mesh

    mesh1: InstancedMesh
    mesh2: InstancedMesh
    mesh3: InstancedMesh

    constructor() {
        
        let stonewall1Texture = new TextureLoader().load(stonewall1Image)
        let stonewall2Texture = new TextureLoader().load(stonewall2Image)
        let stonewall3Texture = new TextureLoader().load(stonewall3Image)

        const geometry = new CylinderGeometry( 3, 3, 10, 16 , 1); 
        const material1 = new MeshPhongMaterial( {map: stonewall1Texture} ); 
        const material2 = new MeshPhongMaterial( {map: stonewall2Texture} ); 
        const material3 = new MeshPhongMaterial( {map: stonewall3Texture} ); 
        
        this.mesh1 = new InstancedMesh(geometry, material1, this.instances)
        this.mesh2 = new InstancedMesh(geometry, material2, this.instances)
        this.mesh3 = new InstancedMesh(geometry, material2, this.instances)

        let twists: number = 10
        let twistSegments: number = 16
        let curvePoints: Vector3[] = []

        // inner twists
        for (let twist: number = 1; twist <= twists; twist++) {

            for (let twistSegment: number = 1; twistSegment <= twistSegments; twistSegment++) {

                let x = Math.sin((twistSegment / twistSegments) * Math.PI * 2) * this.innerRadius
                let y = Math.cos((twistSegment / twistSegments) * Math.PI * 2) * this.innerRadius
                let z = ((this.outerRadius) * (twist / twists)) + ((this.outerRadius / twists) * (twistSegment / twistSegments))

                curvePoints.push(new Vector3(x,y,z))

            }

        }

        // outer half circle

        let globeSegments: number = 32
        // size 500, makes 250 one PI

        for (let globeSegment: number = 1; globeSegment <= globeSegments; globeSegment++) {

            let x = Math.sin(arcRad * (globeSegment / globeSegments))
            let y = 0
            let z = Math.cos(arcRad * (globeSegment / globeSegments))

            curvePoints.push(new Vector3(x,y,z))

        }

        this.curve = new CatmullRomCurve3(curvePoints, false)

        const curveGeometry: TubeGeometry = new TubeGeometry(this.curve, 500, 0.01, 16)

        this.curveMesh = new Mesh(curveGeometry, material2)
        this.curveMesh.name = 'flyCurveMesh'

        /*
        for (let i: number = 0 ; i < this.mesh.count; i++ ) {
            //for (let i: number = 1 ; i <= 10; i++ ) {
        
            if (i % 3 == 0) this.mesh.

              let radius: number = 20
              let progress: number = (i / instancedMeshObject.count) + autoInstance.offsetProgress
              matrixDummy.position.set (autoInstance.offsetX, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
              matrixDummy.rotation.x = 0
              matrixDummy.rotateX((Math.PI * 2) * progress)
              matrixDummy.updateMatrix();
        
              instancedMeshObject.setMatrixAt(i, matrixDummy.matrix)
        
            }
        
            // instancedMeshObject.rotation.x = ticks * autoInstance.speed
        
        */

    }

    update (ticks) {



    }
    
}