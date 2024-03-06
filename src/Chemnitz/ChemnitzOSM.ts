import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters, MeshBasicMaterial, LineBasicMaterial } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

import ChemnitzGeojson from './geojson/ChemnitzFluesseUndStrassen.json'
import { LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

interface overpassFeatures {
    type: string
    generator: string
    copyright: string
    timestamp: string
    features: any[]
}

interface overpassFeature {
    type: string
    properties: {
        highway: string
        waterway: string
        lanes: number
        width: number
    }
    geometry: {
        id: string
        type: string
        coordinates: [[number, number]]
    }
}

export default class ChemnitzOSM {

    geojson: overpassFeatures = ChemnitzGeojson
    minLat: number = 1000
    maxLat: number = 0
    minLon: number = 1000
    maxLon: number = 0

    center: [number, number] = [12.919292512170788, 50.832438133484864]
    size: number = 500 // 1 degree is 111km. 1 degree is 111.000 meters. we use 1 WE = 500m.
    scale: number = 222 // how many WU per degree?
    radius: number = 0.05 // in degrees, so +/- 7 km = 14km now 10!!

    mesh = new Group()
    meshMirrored = new Group()
    

    constructor() {

        Object.values(this.geojson.features).forEach((feature: overpassFeature) => {



            if (feature.geometry.type === 'LineString') {

                Object.values(feature.geometry.coordinates).forEach(coordinate => {


                    this.minLat = Math.min(this.minLat, coordinate[0])
                    this.maxLat = Math.max(this.maxLat, coordinate[0])

                    this.minLon = Math.min(this.minLon, coordinate[1])
                    this.maxLon = Math.max(this.maxLon, coordinate[1])

                })
            
            }

        })

        console.log(this.minLat, this.maxLat, this.minLon, this.maxLon)

        // for the scale to work correctly, get the average of both min/max latitude and longitude

        // we want the smallest difference for the scale, because the map might be in different width and height
        let diffMin: number = Math.min((this.maxLat - this.minLat), (this.maxLon - this.minLon))
        console.log(diffMin)

        let cardCenter: [number, number] = [(this.maxLat + this.minLat) / 2, (this.maxLon + this.minLon) / 2]

        let scale = this.size / diffMin
        
        // this makes the offset so that the coordinates map from - to +
        let offsetLat = cardCenter[0]
        let offsetLon = cardCenter[1]

        // this takes the difference from the city center to the card center
        let centerOffsetLat: number = (this.center[0] - cardCenter[0]) 
        let centerOffsetLon: number = (this.center[1] - cardCenter[1]) 

        // we add this difference to the offset to make the city center position 0,0 
        offsetLat = offsetLat + centerOffsetLat
        offsetLon = offsetLon + centerOffsetLon
        
        let lastLanes: number = 2
        let lastWidth: number = 20
        

            Object.values(this.geojson.features).forEach((feature: overpassFeature) => {

                if (feature.properties.hasOwnProperty('waterway')) {

                    
                    if (feature.properties.waterway === 'river') {

                        let width: number = feature.properties.width
                        if (width === undefined || width < 3) width = lastWidth
        
                        let curvePoints: Vector3[] = []
                        let curvePointsMirrored: Vector3[] = []
                        
        
                        Object.values(feature.geometry.coordinates).forEach(coordinate => {
        
                            let x = this.scale * (coordinate[0] - offsetLat) 
                            let y = this.scale * (coordinate[1] - offsetLon) 

                            //let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size
                            
                            let distanceToCenter = Math.sqrt((x**2) + (y**2))

                            //console.log(distanceToCenter, x,y)


                            let wuradius = this.radius * this.scale

                            if (distanceToCenter < wuradius) {

                                // hypothenuse is radius
                                // ankathete is distance
                                let z = Math.sqrt((wuradius**2) - (distanceToCenter ** 2)) - wuradius - 0.02 // water is 10m bit below
                                let zMirrored = -(Math.sqrt((wuradius**2) - (distanceToCenter ** 2))) - wuradius + 0.02 // water a bit below
        
                                curvePoints.push(new Vector3(x, y, z))
                                curvePointsMirrored.push(new Vector3(x,y,zMirrored))

                            }
                        
                        })

                        if (curvePoints.length > 1) {
                
                            let path: CatmullRomCurve3 = new CatmullRomCurve3(curvePoints)
                            let pathMirrored: CatmullRomCurve3 = new CatmullRomCurve3(curvePointsMirrored)
            
                            //let lineGeometry = new BufferGeometry().setFromPoints(linePoints)
                            // let tubeGeometry = new TubeGeometry(path, curvePoints.length, (width + lastWidth) * 0.0002, 8, false)
                            let tubeGeometry = new TubeGeometry(path, curvePoints.length, 0.03, 8, false)
                            let tubeGeometryMirrored = new TubeGeometry(pathMirrored, curvePointsMirrored.length, 0.03, 8, false)
                            let tubeMaterial = new MeshPhongMaterial( { color: new Color(0xADDFFF) })
                            this.mesh.add(new Mesh(tubeGeometry, tubeMaterial))
                            this.meshMirrored.add(new Mesh(tubeGeometryMirrored, tubeMaterial))

            
                            lastWidth = width

                        }
        
                    }
                    
                    
                    if (feature.properties.waterway === 'stream') {
        
                        let linePoints: Vector3[] = []
                        let linePointsMirrored: Vector3[] = []
                        
                        Object.values(feature.geometry.coordinates).forEach(coordinate => {
        
                            let x = this.scale * (coordinate[0] - offsetLat) 
                            let y = this.scale * (coordinate[1] - offsetLon) 
                            //let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size
                            
                            let distanceToCenter = Math.sqrt((x**2) + (y**2))

                            let wuradius = this.radius * this.scale

                            if (distanceToCenter < wuradius) {

                                // hypothenuse is wuradius
                                // ankathete is distance
                                let z = Math.sqrt((wuradius**2) - (distanceToCenter ** 2)) - wuradius - 0.02
                                let zMirrored = - (Math.sqrt((wuradius**2) - (distanceToCenter ** 2))) - (wuradius) + 0.02
        
                              linePoints.push(new Vector3(x, y, z))
                              linePointsMirrored.push(new Vector3(x, y, zMirrored))

                            }
                        
                        })
        
                        if (linePoints.length > 1) {

                            let pointWidthFunction = function (p) { return .01 } // 5m breite Bäche
                            let lineColor = new Color(0xab00ff)
            
                            
                            let meshlineGeometry = new MeshLineGeometry()
                            meshlineGeometry.setPoints(linePoints, pointWidthFunction)

                            let meshlineMirroredGeometry = new MeshLineGeometry()
                            meshlineMirroredGeometry.setPoints(linePointsMirrored, pointWidthFunction)
            
                            let meshlineMaterial = new MeshLineMaterial({ color: lineColor })
                            /*
                                var material = new MeshLineMaterial({
                                map: strokeTexture,
                                useMap: params.strokes,
                                color: new THREE.Color(colors[~~Maf.randomInRange(0, colors.length)]),
                                opacity: 1, //params.strokes ? .5 : 1,
                                dashArray: params.dashArray,
                                dashOffset: params.dashOffset,
                                dashRatio: params.dashRatio,
                                resolution: resolution,
                                sizeAttenuation: params.sizeAttenuation,
                                lineWidth: params.lineWidth,
                                depthWrite: true,
                                depthTest: true,
                                alphaTest: params.strokes ? 0.5 : 0,
                                transparent: true,
                                side: THREE.DoubleSide,
                            })
                            */
            
                            let meshLineInstance = new MeshLine(meshlineGeometry, meshlineMaterial)

                            this.mesh.add(meshLineInstance)
                            let meshLineMirroredInstance = new MeshLine(meshlineMirroredGeometry, meshlineMaterial)
                            this.meshMirrored.add(meshLineMirroredInstance)

                        }
        
                    }

                }

                if (feature.properties.hasOwnProperty('highway')) {

                
                /* old, use Meshline and include PR fixes in @lume/DIST/meshline.glsl.js: #include <common> in line 4 
                if (feature.properties.highway === 'primary') {

                    let curvePoints: Vector3[] = []

                    Object.values(feature.geometry.coordinates).forEach(coordinate => {

                        let x = this.scale * (coordinate[0] - offsetLat) 
                        let y = this.scale * (coordinate[1] - offsetLon) 
                        let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size
                        z = 0

                        curvePoints.push(new Vector3(x, y, z))
                    
                    })
        
                    let path: CatmullRomCurve3 = new CatmullRomCurve3(curvePoints)

                    //let lineGeometry = new BufferGeometry().setFromPoints(linePoints)
                    let tubeGeometry = new TubeGeometry(path, curvePoints.length, 0.3, 4, false)
                    let tubeMaterial = new MeshPhongMaterial( { color: 'white' })
                    this.mesh.add(new Mesh(tubeGeometry, tubeMaterial))

                }
                */

            

                let linePoints: Vector3[] = []
                let loop: number = 0

                let lanes: number = feature.properties.lanes
                if (lanes === 0 || lanes === 1 || lanes === undefined) lanes = lastLanes

                Object.values(feature.geometry.coordinates).forEach(coordinate => {

                    let x = this.scale * (coordinate[0] - offsetLat) 
                    let y = this.scale * (coordinate[1] - offsetLon) 
                    //let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size

                    let distanceToCenter = Math.sqrt((x**2) + (y**2))

                    let wuradius = this.radius * this.scale

                    if (distanceToCenter < wuradius) {

                        // hypothenuse is wuradius
                        // ankathete is distance
                        let z = Math.sqrt((wuradius**2) - (distanceToCenter ** 2)) - wuradius

                        linePoints.push(new Vector3(x, y, z))

                    }
                
                })

                let pointWidthFunction = function (p) { return .1 }
                let lineColor = new Color(0x47E1D2)

                if (feature.properties.highway === 'primary') {
                    pointWidthFunction = function (p) { return (lanes + lastLanes) * 0.03 }
                    pointWidthFunction = function (p) { return 0.024 } // 12m breite Straße

                    lineColor = new Color(0x5500E1)
                }

                if (feature.properties.highway === 'secondary') {
                    pointWidthFunction = function (p) { return (lanes + lastLanes) * 0.02 }
                    pointWidthFunction = function (p) { return 0.02 }  // 10m breite Straße
                    lineColor = new Color(0xE1673E)
                }

                if (feature.properties.highway === 'tertiary' || feature.properties.highway === 'residential') {
                    pointWidthFunction = function (p) { return .01 } // 5m breite Straße
                    lineColor = new Color(0xFEFEFE)

                }



                if (linePoints.length > 1) {

                    if (feature.properties.highway === 'tertiary' || feature.properties.highway === 'residential') {

                        let lineGeometry = new BufferGeometry()
                        lineGeometry.setFromPoints(linePoints)
                        let lineMaterial = new LineBasicMaterial({ color: 'white' })
                        let lineInstance = new Line(lineGeometry, lineMaterial)

                        this.mesh.add(lineInstance)

                    }
                    
                    else {
                        
                        let meshlineGeometry = new MeshLineGeometry()
                        meshlineGeometry.setPoints(linePoints, pointWidthFunction)

                        let meshlineMaterial = new MeshLineMaterial({ color: lineColor })
                        /*
                            var material = new MeshLineMaterial({
                            map: strokeTexture,
                            useMap: params.strokes,
                            color: new THREE.Color(colors[~~Maf.randomInRange(0, colors.length)]),
                            opacity: 1, //params.strokes ? .5 : 1,
                            dashArray: params.dashArray,
                            dashOffset: params.dashOffset,
                            dashRatio: params.dashRatio,
                            resolution: resolution,
                            sizeAttenuation: params.sizeAttenuation,
                            lineWidth: params.lineWidth,
                            depthWrite: true,
                            depthTest: true,
                            alphaTest: params.strokes ? 0.5 : 0,
                            transparent: true,
                            side: THREE.DoubleSide,
                        })
                        */

                        let meshLineInstance = new MeshLine(meshlineGeometry, meshlineMaterial)
                        this.mesh.add(meshLineInstance)

                    }

                }

                lastLanes = lanes

            }

        })

        //this.meshMirrored.scale.multiply(new Vector3(1, 1, -1))
        //this.meshMirrored.position.set(0,0,-this.size)

        this.mesh.add(this.meshMirrored)

        this.mesh.position.set(0, 0, 0)
        this.mesh.rotateX(-Math.PI/2)

    }

}