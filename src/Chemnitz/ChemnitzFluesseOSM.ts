import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

import ChemnitzGeojson from '../geojson/ChemnitzFluesseUndStrassen.json'

import { overpassFeatures, overpassFeature } from "./ChemnitzOSM";

export default class ChemnitzFluesseOSM {

    geojson: overpassFeatures = ChemnitzGeojson
    minLat: number = 1000
    maxLat: number = 0
    minLon: number = 1000
    maxLon: number = 0

    center: [number, number] = [12.919292512170788, 50.832438133484864]
    size: number = 150

    mesh = new Group()

    constructor() {

        Object.values(this.geojson.features).forEach((feature: overpassFeature) => {

            Object.values(feature.geometry.coordinates).forEach(coordinate => {
                
                this.minLat = Math.min(this.minLat, coordinate[0])
                this.maxLat = Math.max(this.maxLat, coordinate[0])

                this.minLon = Math.min(this.minLon, coordinate[1])
                this.maxLon = Math.max(this.maxLon, coordinate[1])
            
            })

        })


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

        let lastWidth: number = 20 
        
        Object.values(this.geojson.features).forEach((feature: overpassFeature) => {

            
            if (feature.properties.waterway === 'river') {

                let width: number = feature.properties.width
                if (width === undefined || width < 3) width = lastWidth

                let curvePoints: Vector3[] = []

                Object.values(feature.geometry.coordinates).forEach(coordinate => {

                    let x = (coordinate[0] - offsetLat) * scale
                    let y = (coordinate[1] - offsetLon) * scale
                    //let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size
                    
                    let phi = (x / this.size) * (Math.PI / 3)
                    let theta = (y / this.size) * (Math.PI / 3)
                    
                    let radius = this.size * (2/3)
    
                    let z = (Math.cos(phi) * radius) + (Math.cos(theta) * radius) - radius - radius

                    curvePoints.push(new Vector3(x, y, z))
                
                })
    
                let path: CatmullRomCurve3 = new CatmullRomCurve3(curvePoints)

                //let lineGeometry = new BufferGeometry().setFromPoints(linePoints)
                let tubeGeometry = new TubeGeometry(path, curvePoints.length, (width + lastWidth) * 0.0002, 8, false)
                let tubeMaterial = new MeshPhongMaterial( { color: new Color(0x8300c42) })
                this.mesh.add(new Mesh(tubeGeometry, tubeMaterial))

                lastWidth = width

            }
            
            if (feature.properties.waterway === 'stream') {

                let linePoints: Vector3[] = []

                Object.values(feature.geometry.coordinates).forEach(coordinate => {

                    let x = (coordinate[0] - offsetLat) * scale
                    let y = (coordinate[1] - offsetLon) * scale
                    //let z = Math.sin((Math.sqrt(x**2 + y**2) / (this.size/2)) * (Math.PI/4)) * this.size
                    
                    let phi = (x / this.size) * (Math.PI / 3)
                    let theta = (y / this.size) * (Math.PI / 3)
                    
                    let radius = this.size * (2/3)

                    let z = (Math.cos(phi) * radius) + (Math.cos(theta) * radius) - radius - radius

                    linePoints.push(new Vector3(x, y, z))
                
                })

                let pointWidthFunction = function (p) { return .1 }
                let lineColor = new Color(0xab00ff)


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
                //this.mesh.add(meshLineInstance)

            }

        })

        this.mesh.position.set(0, 0, 0)
        this.mesh.rotateX(-Math.PI/2)

    }

}