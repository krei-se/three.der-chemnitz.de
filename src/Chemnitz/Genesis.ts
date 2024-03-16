import { Mesh, Group, Line, Vector3, BufferGeometry, TubeGeometry, MeshPhongMaterial, CatmullRomCurve3, Color, ShaderMaterialParameters, NumberKeyframeTrack } from "three";

import {MeshLine, MeshLineGeometry, MeshLineMaterial} from '@lume/three-meshline'

import GenesisMap, { GenesisAbilityInterface, GenesisLevelInterface, GenesisPartInterface } from "./GenesisMap";
import Chemnitz from "./Chemnitz";

export interface GenesisInstanceInterface {
    level: GenesisLevelInterface,
    parts: {
        [name: string]: {
            part: GenesisPartInterface
            size?: number
            offsetY?: number
        }
    },
    abilities?: {
        [name: string]: GenesisAbilityInterface
    }
}

export interface GenesisDivPartInterface {
    min: number,
    max: number,
    value: number
}

export interface GenesisDivPartsInterface {
    [name: string]: GenesisDivPartInterface
}

export default class Genesis {

    genesisDiv: HTMLDivElement = document.createElement('div')
    genesisDivParts: GenesisDivPartsInterface = {}

    instanceMap: GenesisInstanceInterface = { level: GenesisMap.levels.cyborg }
    mesh: Group = new Group()

    public debugMode: boolean = false

    constructor(instanceMap: Partial<GenesisInstanceInterface> = {}) {

        this.instanceMap.level = instanceMap.level?? GenesisMap.levels.cyborg
        this.instanceMap.parts = instanceMap.parts?? this.instanceMap.level.parts ?? GenesisMap.levels[this.instanceMap.level.name].parts ?? {} // @TODO stub this
        this.instanceMap.abilities = instanceMap.abilities?? this.instanceMap.level.abilities ?? GenesisMap.levels[this.instanceMap.level.name].abilities ?? {}
        
        this.createGenesisDiv()
        
    }

    morph(instanceMap: Partial<GenesisInstanceInterface> = {}) {

        

    }

    createBaseGroup() {

        /*
        this.genesis.{circles}.array.forEach(element => {
            
        });
        */

    }

    updateParts() {



    }

    createGenesisDiv() {

        this.genesisDiv.id = 'genesisDiv'

        this.genesisDiv.classList.add('applyInvertFilter')

        // TITLE
        let genesisHeader = document.createElement('h2')
        genesisHeader.innerHTML = 'Genesis (im Aufbau)'
        let genesisChapterTitle = document.createElement('p')

        genesisChapterTitle.innerHTML = 'Grund-Ton Art:'

        // LEVEL SELECTOR
        let genesisLevelSelect = document.createElement('select')
        genesisLevelSelect.classList.add('genesisLevel')
        genesisLevelSelect.id = 'genesisLevelSelect'
        

        Object.entries(GenesisMap.levels).forEach(([levelKey, level]) => { // level index is the shorthand like 'cyborg'.
            
            let genesisLevelSelectItem = new Option(level.name, levelKey)
            if (level === (this.instanceMap.level)) genesisLevelSelectItem.selected = true
            genesisLevelSelect.append(genesisLevelSelectItem)

        });

        genesisLevelSelect.addEventListener('change', (event: Event) => {

            let genesisLevelSelect = (event.target as HTMLSelectElement)
            if (genesisLevelSelect.value in GenesisMap.levels) {

                this.instanceMap.level = GenesisMap.levels[genesisLevelSelect.value]
                this.instanceMap.parts = GenesisMap.levels[genesisLevelSelect.value].parts ?? {} // @TODO stub this
                this.instanceMap.abilities = GenesisMap.levels[genesisLevelSelect.value].abilities ?? {}

                this.updateGenesisDivParts()

            }
        })

        this.genesisDiv.append(genesisHeader)
        this.genesisDiv.append(genesisChapterTitle)
        this.genesisDiv.append(genesisLevelSelect)
        
        // PART SLIDERS
        this.updateGenesisDivParts()

    }

    updateGenesisDebugParagraph() {

        if (this.debugMode) {

            let genesisDebugParagraph: HTMLParagraphElement
            genesisDebugParagraph = document.querySelector('#genesisDebugParagraph') ?? document.createElement('p')
            genesisDebugParagraph.id = 'genesisDebugParagraph'

            genesisDebugParagraph.innerHTML =  JSON.stringify(this.instanceMap, null, 2)

            this.genesisDiv.append(genesisDebugParagraph)

        }

    }

    updateGenesisDivParts() {

        let genesisDivPartsForm: HTMLFormElement
        genesisDivPartsForm = document.querySelector('#genesisDivParts') ?? document.createElement('form')
        
        genesisDivPartsForm.id = 'genesisDivParts'
        this.genesisDiv.append(genesisDivPartsForm)
       
        Object.entries(this.genesisDivParts).forEach(([divPartName, divPart]) => {

            if (!(divPartName in this.instanceMap.parts)) {
                delete this.genesisDivParts[divPartName]
            }
        })

        Object.entries(this.instanceMap.parts).forEach(([partKey, partObject], partIndex) => {

            let genesisDivPart: GenesisDivPartInterface = this.genesisDivParts[partKey] ?? { min: 0, max: 0, value: 0 }

            genesisDivPart.min = this.genesisDivParts[partKey]?.min ?? partObject.part.size + (partObject.part.sizeRange?.[0] || 0)
            genesisDivPart.max = this.genesisDivParts[partKey]?.max ?? partObject.part.size + (partObject.part.sizeRange?.[1] || 0)
            genesisDivPart.value = this.genesisDivParts[partKey]?.value ?? (genesisDivPart.max + genesisDivPart.min) / 2

            this.genesisDivParts[partKey] = genesisDivPart

        })

        let existingPartParagraphs = document.querySelectorAll('p.partRangeParagraph')
        
        existingPartParagraphs.forEach((element, key, parent) => {

            if (!(element.id in this.genesisDivParts)) {
                genesisDivPartsForm.removeChild(element)
            }
            
        })

        existingPartParagraphs = document.querySelectorAll('p.partRangeParagraph')
        let existingPartParagraphsIds: string[] = Array.from(existingPartParagraphs).map(element => element.id)

        Object.entries(this.genesisDivParts).forEach(([divPartKey, divPart]) => {

            if (!existingPartParagraphsIds.includes(divPartKey)) {

                let partRangeParagraph = document.createElement('p')
                partRangeParagraph.classList.add('partRangeParagraph')
                partRangeParagraph.id = divPartKey
                partRangeParagraph.innerHTML = this.instanceMap.parts[divPartKey].part.name + "<br>"

                let partRangeSlider = document.createElement('input');
                partRangeSlider.id = 'partRangeSlider_' + divPartKey
                partRangeSlider.type = 'range'
                partRangeSlider.min = divPart.min.toString()
                partRangeSlider.max = divPart.max.toString()
                partRangeSlider.value = divPart.value.toString()
                //partRangeSlider.defaultValue = divPart.value.toString()
                partRangeSlider.onchange = () => {
                    console.log(partRangeSlider.value)
                    // this.instanceMap.parts[divPartKey].
                    this.updateGenesisDebugParagraph()
                    this.updateParts()

                }
                partRangeSlider.step = '0.01'
                partRangeParagraph.append(partRangeSlider)
                genesisDivPartsForm.append(partRangeParagraph)

           }
            
        })

    }
    
}