export interface GenesisPartInterface {
  name: string
  base?: { [name: string]: { part: GenesisPartInterface, offsetY?: number }}
  size: number
  sizeRange?: [number, number]
  yRange?: [number, number]
}

export interface GenesisAbilityInterface {
    name: string
}

export interface GenesisLevelInterface {
  name: string
  amount: number
  parts?: {
    [name: string]: {
      part: GenesisPartInterface
      offsetY?: number
    }
  }
  abilities?: {
    [name: string]: GenesisAbilityInterface
  }
}

export interface GenesisMapInterface {
  levels: {
    [name: string]: GenesisLevelInterface
  }
  parts: {
    [name: string]: GenesisPartInterface
  }
  abilities: {
    [name: string]: GenesisAbilityInterface
  }
}

// gets exported in last line
const GenesisMap: GenesisMapInterface = {

  levels: {

    cell:           { name: 'Single Cell Organism'      , amount: 1  },
    multicellular:  { name: 'Multicellular Organism'    , amount: 2  },
    invertebrate:   { name: 'Invertebrate'              , amount: 3  },
    vertebrate:     { name: 'Vertebrate'                , amount: 4  },     // @TODO add Akira and Miffy
    primate:        { name: 'Primate'                   , amount: 5  },
    caveman:        { name: 'Caveman'                   , amount: 6  },
    human:          { name: 'Homo sapiens sapiens'      , amount: 7  },
    cyborg:         { name: 'Advanced Human (Cyborg)'   , amount: 8  },
    deity:          { name: 'Deity'                     , amount: 9  },
    supreme:        { name: 'Supreme Being'             , amount: 10 },
    singularity:    { name: 'Singularity'               , amount: 11 },
    almighty:       { name: 'Almighty Creator'          , amount: 12 }
    
  },
  
  parts: { 
    pelvis:     { name: 'Pelvis'              , size: 2, sizeRange: [1.75, 2.25]                              }, 
    abdomen:    { name: 'Abdomen'             , size: 2, sizeRange: [1.5 , 2.25], yRange: [-0.25, 0.25]       }, 
    thorax:     { name: 'Thorax'              , size: 2, sizeRange: [1.75, 2.5 ]                              }, 
    collum:     { name: 'Neck and Shoulders'  , size: 2, sizeRange: [1.5 , 2.25]                              },
    caput:      { name: 'Head'                , size: 1, sizeRange: [0.7 , 1.5 ], yRange: [-0.25, 0.25]       },
    mandible:   { name: 'Jaw'                 , size: 1, sizeRange: [0.85, 1.25], yRange: [-0.25, 0.25]       },
    femur:      { name: 'Thigh'               , size: 2, sizeRange: [1.75, 2.5 ], yRange: [-0.5 , 0.5 ]       },
    flute:      { name: 'Shinbone'            , size: 2, sizeRange: [1.5 , 2.25], yRange: [-0.5 , 0.5 ]       },
    halo:       { name: 'Halo'                , size: 2, sizeRange: [1.5 , 2.5 ], yRange: [-1   , 1   ]       }
  },

  abilities: { 
    hasMelody:  { name: 'hasMelody' }, 
    hasPulse:   { name: 'hasPulse'  },
    canSing:    { name: 'canSing'   }, 
    canDrive:   { name: 'canDrive'  }, 
    canFly:     { name: 'canFly'    }
  }

}


GenesisMap.parts.abdomen.base = { 
  pelvis:     { part: GenesisMap.parts.pelvis,    offsetY: 1    }
}

// allow thorax on neck when no abdomen available
GenesisMap.parts.thorax.base = {
  abdomen:    { part: GenesisMap.parts.abdomen,   offsetY: 1    },
  collum:     { part: GenesisMap.parts.collum,    offsetY: -1   }
}

GenesisMap.parts.collum.base = {
  thorax:     { part: GenesisMap.parts.thorax,    offsetY: 1    }
}

// allow head on thorax when no neck available
GenesisMap.parts.caput.base = {
  collum:     { part: GenesisMap.parts.collum,    offsetY: 1    },
  thorax:     {part: GenesisMap.parts.thorax,     offsetY: 2    }
}

GenesisMap.parts.mandible.base = {
    head:     { part: GenesisMap.parts.head,      offsetY: -0.5 },
}

GenesisMap.parts.femur.base = {
    pelvis:   { part: GenesisMap.parts.pelvis,    offsetY: -1   }
}

GenesisMap.parts.flute.base = {
    femur:    { part: GenesisMap.parts.femur,     offsetY: -2   }
}

// Evolution Levels
GenesisMap.levels.human.parts = {
  pelvis:   { part: GenesisMap.parts.pelvis   },
  abdomen:  { part: GenesisMap.parts.abdomen  },
  thorax:   { part: GenesisMap.parts.thorax   },
  collum:   { part: GenesisMap.parts.collum   },
  caput:    { part: GenesisMap.parts.caput    },
  femur:    { part: GenesisMap.parts.femur    },
  flute:    { part: GenesisMap.parts.flute    }
}

GenesisMap.levels.cyborg.parts = {
  pelvis:   { part: GenesisMap.parts.pelvis   },
  abdomen:  { part: GenesisMap.parts.abdomen  },
  thorax:   { part: GenesisMap.parts.thorax   },
  collum:   { part: GenesisMap.parts.collum   },
  caput:    { part: GenesisMap.parts.caput    },
  mandible: { part: GenesisMap.parts.mandible },
  femur:    { part: GenesisMap.parts.femur    },
  flute:    { part: GenesisMap.parts.flute    }
}

// if you try to copy parts by doing .parts = someotherlever.parts you will end up with 2 entities with the same parts
// because it will be referencing both
GenesisMap.levels.deity.parts = {
  pelvis:   { part: GenesisMap.parts.pelvis   },
  abdomen:  { part: GenesisMap.parts.abdomen  },
  thorax:   { part: GenesisMap.parts.thorax   },
  collum:   { part: GenesisMap.parts.collum   },
  caput:    { part: GenesisMap.parts.caput    },
  mandible: { part: GenesisMap.parts.mandible },
  femur:    { part: GenesisMap.parts.femur    },
  flute:    { part: GenesisMap.parts.flute    },
  halo:     { part: GenesisMap.parts.halo     },
}  

// Abilities

GenesisMap.levels.human.abilities = { 
  hasMelody: GenesisMap.abilities.hasMelody 
}

GenesisMap.levels.cyborg.abilities = { 
  hasMelody: GenesisMap.abilities.hasMelody 
}

GenesisMap.levels.deity.abilities = { 
  hasMelody: GenesisMap.abilities.hasMelody,
  canFly: GenesisMap.abilities.canFly
}

GenesisMap.levels.singularity.abilities = {
  hasPulse: GenesisMap.abilities.hasPulse
}


export default GenesisMap 