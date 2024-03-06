import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

export default class Genesis {

    circles: number = 8 // wir fangen mal mit dem Helden an :)
    circleMap: string[] = ['Cell', 'Multicellular', 'Invertebrate', 'Vertebrate', 'Primate', 'Early Human', 'Modern Human', 'Advanced Human', 'Deity', 'Supreme Being', 'Transcendental Entity', 'Creator God']

    genesis: any = {

        8: {
            sizeRange: [7,8],
            parts: {
                1: {
                    name: 'Kopf',
                    size: 1,
                    originY: 3.5,
                    sizeRange: [0.7, 1.5],
                    offsetYRange: [-0.25, 0.25]
                },
                2: {
                    name: 'Kiefer',
                    size: 1,
                    originY: 3,
                    sizeRange: [0.7, 1.5],
                    offsetYRange: [-0.25, 0.25]
                },
                3: {
                    name: 'Nacken und Schultern',
                    size: 2,
                    originY: 3,
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                },
                4: {
                    name: 'Thorax (Herz)',
                    size: 2,
                    originY: 2,
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                },
                5: {
                    name: 'Bauch',
                    size: 2,
                    originY: 1,
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                },
                6: {
                    name: 'Becken',
                    size: 2,
                    originY: 0,                  // <--- Origin
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                },
                7: {
                    name: 'Oberschenkel',
                    size: 2,
                    originY: -1,
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                },
                8: {
                    name: 'Unterschenkel + Füße',
                    size: 2,
                    originY: -3,                    
                    sizeRange: [1, 3],
                    offsetYRange: [-0.5, 0.5]
                }
            }
 
        }

    }

    instanceMap: any = {}

    mesh: Group = new Group()

    constructor(circles: number = 8, instanceMap: any = {}) {

        this.circles = circles
        this.instanceMap = instanceMap



    }

    createBaseGroup() {

        /*
        this.genesis.{circles}.array.forEach(element => {
            
        });
        */

    }
    
}