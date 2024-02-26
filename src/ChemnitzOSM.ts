import { Mesh } from "three";

import * as ChemnitzHighwaysGeojson from './ChemnitzHighways.geojson'

interface overpassFeatures {
    type: string
    timestamp: string
    copyright: string
    features: {
        type: string
        properties: {
            highway: string
        }
        geometry: {
            id: string
            type: string
            coordinates: [[number, number]]
        }
    }
}

export default class ChemnitzOSM {

    geojson: overpassFeatures = JSON.parse(ChemnitzHighwaysGeojson)

    constructor() {

        Object.values(this.geojson.features).forEach(element => {
            console.log (element)
        });

    }

}