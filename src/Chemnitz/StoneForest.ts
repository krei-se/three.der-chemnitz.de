import { Mesh, Vector3, TubeGeometry, CatmullRomCurve3, InstancedMesh, TextureLoader, CylinderGeometry, Object3D, RepeatWrapping, MeshBasicMaterial, DoubleSide } from "three";

import stonewall1Image from 'textures/stonewall1.png'
import stonewall2Image from 'textures/stonewall2.png'
import stonewall3Image from 'textures/stonewall3.png'

import { FBXLoader } from "three/examples/jsm/Addons.js";

export default class StoneForest {

    size: number = 20 // for the whole globe
    innerRadius: number = 3
    outerRadius: number = (this.size/2)
    instances: number = 12
    curve: CatmullRomCurve3
    curveMesh: Mesh

    mesh1: InstancedMesh = new InstancedMesh()
    mesh2: InstancedMesh = new InstancedMesh()
    mesh3: InstancedMesh = new InstancedMesh()
    debugMesh: Mesh = new Mesh()

    loadingDone: boolean = false
    loadingPromise: Promise<void>

    constructor(size: number = 20) {

        this.size = size
        this.outerRadius = this.size/2

        // this.loadingPromise = this.load()

    }

    async load(): Promise<void> {
        
        let stonewall1Texture = new TextureLoader().load(stonewall1Image)
        stonewall1Texture.wrapS = RepeatWrapping
        stonewall1Texture.wrapT = RepeatWrapping
        stonewall1Texture.repeat.set(3,4)

        let stonewall2Texture = new TextureLoader().load(stonewall2Image)
        stonewall2Texture.wrapS = RepeatWrapping
        stonewall2Texture.wrapT = RepeatWrapping
        stonewall2Texture.repeat.set(3,4)
        
        let stonewall3Texture = new TextureLoader().load(stonewall3Image)
        stonewall3Texture.wrapS = RepeatWrapping
        stonewall3Texture.wrapT = RepeatWrapping
        stonewall3Texture.repeat.set(3,4)
        

        const geometry = new CylinderGeometry( 0.1, 0.1, 1.6, 8 , 1); 
        // const material1 = new MeshPhongMaterial( {color: 'white', map: stonewall1Texture, bumpMap: stonewall1Texture} ); 
        // const material2 = new MeshPhongMaterial( {color: 'white', map: stonewall2Texture, bumpMap: stonewall2Texture} ); 
        // const material3 = new MeshPhongMaterial( {color: 'white', map: stonewall3Texture, bumpMap: stonewall3Texture} ); 


        // you cannot use await on this because its not structured like a Promise
        const loadFBXModel = () => {
            return new Promise<void>((resolve, reject) => {

                const timeOut = setTimeout(() => { reject(new Error("Loading timed out")) }, 5000)

                const loader = new FBXLoader();
                loader.load( 'models/stoneforest1.fbx', (stoneforestFBX) => {

                    stoneforestFBX.scale.multiplyScalar(0.01)
                    let model = stoneforestFBX.getObjectByName('3DModel_LowPoly') as Mesh
                    model.material.side = DoubleSide
                    
                    console.log(stoneforestFBX)
                    console.log (model)
                    this.mesh1 = new InstancedMesh(model.geometry, model.material, this.instances)
                    this.mesh1.rotateX(Math.PI/2)


                    this.mesh2 = new InstancedMesh(model.geometry, model.material, this.instances)
                    this.mesh2.rotateX(Math.PI/2)
                    this.mesh2.rotateZ(Math.PI * 2 / 3)

                    
                    this.mesh3 = new InstancedMesh(model.geometry, model.material, this.instances)
                    this.mesh3.rotateX(Math.PI/2)
                    this.mesh3.rotateZ(Math.PI * 4 / 3)


                    this.loadingDone = true
                    clearTimeout(timeOut)

                    resolve()

                }, undefined, reject)


            });
        }

        await loadFBXModel();   // if any error occurs in the loading and you don't define error handling here
                                // the .load() method will stop giving the reject of the fbxloader Promise 
        
        // this.mesh1 = new InstancedMesh(geometry, material1, this.instances)
        // this.mesh2 = new InstancedMesh(geometry, material2, this.instances)
        // this.mesh3 = new InstancedMesh(geometry, material3, this.instances)

        let twists: number = 2 // minus a half :)
        let twistSegments: number = 16
        let curvePoints: Vector3[] = []

        let totalTwistParts: number = twists * twistSegments - (twistSegments/2)

        // inner twists
        for (let twist: number = 0; twist < twists; twist++) {

            for (let twistSegment: number = 0; twistSegment < twistSegments; twistSegment++) {

                let x = (Math.sin((twistSegment / twistSegments) * Math.PI * 2) * this.innerRadius)
                let y = (Math.cos((twistSegment / twistSegments) * Math.PI * 2) * this.innerRadius)
                let z = -this.size/2 + (((this.size) * (twist / twists)) + ((this.size / twists) * (twistSegment / twistSegments)))

                curvePoints.push(new Vector3(x,y,z))

            }

        }

        // outer half circle

        let globeSegments: number = 32 // it does not matter the inner radius

        // size 500, makes 250 one PI

        // step one - find the initial sine (segment) from the cosine of the inner radius to set the arc start



        let arcStart: number = 0 // Math.PI/2 - Math.acos((this.innerRadius / 2) / (this.size / 2)) // for 20 and 500 -> 1 / 24 th approx 1/24 Pi / 2
        let arcEnd: number = Math.PI // Math.PI/2 + Math.acos((this.innerRadius / 2) / (this.size / 2))
        
        // console.log("arc", arcStart, arcEnd)

        
        for (let globeSegment: number = 1; globeSegment <= globeSegments; globeSegment++) {

            let arcPart: number = ((arcEnd - arcStart) / globeSegments) * globeSegment

            let x = 0
            let y = (Math.sin(arcPart) * this.outerRadius) + this.innerRadius
            let z = (Math.cos(arcPart) * this.outerRadius)

            curvePoints.push(new Vector3(x,y,z))

        }

        this.curve = new CatmullRomCurve3(curvePoints, true)
        // this.curve = new BufferGeometry().setFromPoints(curvePoints)

        const curveGeometry: TubeGeometry = new TubeGeometry(this.curve, 500, 0.01, 16)
        const curveMaterial: MeshBasicMaterial = new MeshBasicMaterial({color: 'white'})

        this.curveMesh = new Mesh(curveGeometry, curveMaterial)
        this.curveMesh.name = 'twistCurveMesh'

    }

    update (ticks: number = 0) {

        let totalTicks: number = 300000

        if (this.loadingDone) {

            let meshes = [this.mesh1, this.mesh2, this.mesh3]

            meshes.forEach((mesh, meshIndex) => {

                ticks = ticks + (meshIndex * (totalTicks / meshes.length))

                let progress: number = (ticks / totalTicks) - Math.ceil(ticks / totalTicks)

                for (let i: number = 0 ; i < mesh.count; i++ ) {
                
                                // slot in line             // ticks
                let curveProgress: number = (i / mesh.count) - progress
                if (curveProgress > 1) curveProgress = curveProgress - 1

                let j: number = i+1
                if (j === mesh.count) j = 0

                let curveProgressAhead: number = (j / mesh.count)  - progress

                if (curveProgressAhead > 1) curveProgressAhead = curveProgressAhead - 1


                const curvePosition: Vector3 = this.curve.getPointAt(curveProgress)

                const curvePositionLookAt: Vector3 = this.curve.getPointAt(curveProgressAhead)

                const matrixDummy = new Object3D()
                matrixDummy.position.set(curvePosition.x, curvePosition.y, curvePosition.z)
                matrixDummy.lookAt(curvePositionLookAt)
                matrixDummy.rotateX(Math.PI/2)
                matrixDummy.scale.multiplyScalar(0.3)
                matrixDummy.updateMatrix();

                mesh.setMatrixAt(i, matrixDummy.matrix)


                }


                mesh.instanceMatrix.needsUpdate = true;

            })

        }
            
        
    }
    
}