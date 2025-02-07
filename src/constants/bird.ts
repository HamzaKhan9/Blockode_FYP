export enum BIRD_BLOCK_TYPES {
  HEADING = "bird_heading",
  NOWORM = "bird_noWorm",
  AND = "bird_and",
  COMPARE = "bird_compare",
  IFELSE = "bird_ifElse",
  NUMBER = "math_number",
  POSITION = "bird_position",
  CONTROLIF = "controls_if",
}

export const BIRD_BLOCKS = [
  // Block for moving bird in a direction
  {
    type: BIRD_BLOCK_TYPES.HEADING,
    message0: "heading" + "%1",
    args0: [
      {
        type: "field_angle",
        name: "ANGLE",
        angle: 90,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: "Move in the direction of the given angle.",
  },

  // Block for getting bird's x or y position.
  {
    type: BIRD_BLOCK_TYPES.POSITION,
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "XY",
        options: [
          ["x", "X"],
          ["y", "Y"],
        ],
      },
    ],
    output: "Number",
    colour: 290,
    tooltip: "get bird X or Y position",
  },

  // Block for no worm condition.
  {
    type: BIRD_BLOCK_TYPES.NOWORM,
    message0: "does not picked passenger",
    output: "Boolean",
    colour: 290,
    tooltip: "The condition when the plane has not picked passenger.",
  },

  // Block for comparing bird's x or y position with a number.
  {
    type: BIRD_BLOCK_TYPES.COMPARE,
    message0: `%1%2%3`,
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["\u200F<", "LT"],
          ["\u200F>", "GT"],
        ],
      },
      {
        type: "input_value",
        name: "B",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Boolean",
    colour: "%{BKY_LOGIC_HUE}",
    helpUrl: "%{BKY_LOGIC_COMPARE_HELPURL}",
    // extensions: ["bird_compare_tooltip"],
  },

  // Block for logical operator 'and'.
  {
    type: BIRD_BLOCK_TYPES.AND,
    message0: "%1%{BKY_LOGIC_OPERATION_AND}%2",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Boolean",
      },
      {
        type: "input_value",
        name: "B",
        check: "Boolean",
      },
    ],
    inputsInline: true,
    output: "Boolean",
    colour: "%{BKY_LOGIC_HUE}",
    tooltip: "%{BKY_LOGIC_OPERATION_TOOLTIP_AND}",
    helpUrl: "%{BKY_LOGIC_OPERATION_HELPURL}",
  },

  // Block for 'if/else'.
  {
    type: BIRD_BLOCK_TYPES.IFELSE,
    message0:
      "%{BKY_CONTROLS_IF_MSG_IF}%1%{BKY_CONTROLS_IF_MSG_THEN}%2%{BKY_CONTROLS_IF_MSG_ELSE}%3",
    args0: [
      {
        type: "input_value",
        name: "CONDITION",
        check: "Boolean",
      },
      {
        type: "input_statement",
        name: "DO",
      },
      {
        type: "input_statement",
        name: "ELSE",
      },
    ],
    colour: "%{BKY_LOGIC_HUE}",
    tooltip: "%{BKY_CONTROLS_IF_TOOLTIP_2}",
    helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
  },

  // Block for numeric value.
  {
    type: "math_number",
    message0: "%1",
    args0: [
      {
        type: "field_number",
        name: "NUM",
        value: 0,
      },
    ],
    output: "Number",
    helpUrl: "%{BKY_MATH_NUMBER_HELPURL}",
    colour: "%{BKY_MATH_HUE}",
    tooltip: "%{BKY_MATH_NUMBER_TOOLTIP}",
    extensions: ["parent_tooltip_when_inline"],
  },
];

const compareBlockXml = `<block type="bird_compare"><field name="OP">LT</field><value name="A"><block type="bird_position" movable="false"><field name="XY">X</field></block></value><value name="B"><block type="math_number" movable="false"><field name="NUM">50</field></block></value></block>`;

export const BIRD_LEVELS = [
  // Level 1
  {
    plane: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "source",
      nature: "plane",
    },
    airport: {
      cordinates: [
        { x: 230, y: 270 },
        { x: 270, y: 270 },
        { x: 230, y: 230 },
        { x: 270, y: 230 },
      ],
      type: "target",
      nature: "airport",
    },
    passenger: {
      cordinates: [
        { x: 130, y: 170 },
        { x: 170, y: 170 },
        { x: 130, y: 130 },
        { x: 170, y: 130 },
      ],
      type: "target",
      nature: "passenger",
    },
    blockTypes: [BIRD_BLOCK_TYPES.HEADING],
    obstacles: [],
  },
  //level 2
  {
    plane: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 200, y: 70 },
        { x: 240, y: 70 },
        { x: 200, y: 30 },
        { x: 240, y: 30 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 200, y: 270 },
        { x: 240, y: 270 },
        { x: 200, y: 230 },
        { x: 240, y: 230 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 0, y: 140 },
          { x: 0, y: 160 },
          { x: 170, y: 140 },
          { x: 170, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],

    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.IFELSE,
      BIRD_BLOCK_TYPES.NOWORM,
      BIRD_BLOCK_TYPES.CONTROLIF,
    ],
  },
  //level 3
  {
    plane: {
      cordinates: [
        { x: 20, y: 280 },
        { x: 60, y: 280 },
        { x: 20, y: 240 },
        { x: 60, y: 240 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 130, y: 50 },
        { x: 170, y: 50 },
        { x: 130, y: 10 },
        { x: 170, y: 10 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 240, y: 280 },
        { x: 280, y: 280 },
        { x: 240, y: 240 },
        { x: 280, y: 240 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 140, y: 300 },
          { x: 160, y: 300 },
          { x: 140, y: 150 },
          { x: 160, y: 150 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],

    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.IFELSE,
      BIRD_BLOCK_TYPES.NOWORM,
    ],
  },

  //level 4
  {
    plane: {
      cordinates: [
        { x: 20, y: 280 },
        { x: 60, y: 280 },
        { x: 20, y: 240 },
        { x: 60, y: 240 },
      ],
      type: "source",
      nature: "plane",
    },

    airport: {
      cordinates: [
        { x: 230, y: 60 },
        { x: 270, y: 60 },
        { x: 230, y: 20 },
        { x: 270, y: 20 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 4, y: -4 },
          { x: 6, y: 16 },
          { x: 200, y: 185 },
          { x: 185, y: 197 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],
    targets: 1,
    blockTypes: [BIRD_BLOCK_TYPES.HEADING, BIRD_BLOCK_TYPES.IFELSE],
    xml: compareBlockXml,
  },

  //level 5
  {
    plane: {
      cordinates: [
        { x: 250, y: 280 },
        { x: 290, y: 280 },
        { x: 250, y: 240 },
        { x: 290, y: 240 },
      ],
      type: "source",
      nature: "plane",
    },

    airport: {
      cordinates: [
        { x: 30, y: 65 },
        { x: 70, y: 65 },
        { x: 30, y: 25 },
        { x: 70, y: 25 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: -11, y: 298 },
          { x: 7, y: 307 },
          { x: 200, y: 80 },
          { x: 220, y: 100 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],
    targets: 1,
    blockTypes: [BIRD_BLOCK_TYPES.HEADING, BIRD_BLOCK_TYPES.IFELSE],
    xml: compareBlockXml,
  },

  //level 6
  {
    plane: {
      cordinates: [
        { x: 20, y: 150 },
        { x: 60, y: 150 },
        { x: 20, y: 110 },
        { x: 60, y: 110 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 230, y: 60 },
        { x: 270, y: 60 },
        { x: 230, y: 20 },
        { x: 270, y: 20 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 25, y: 280 },
        { x: 65, y: 280 },
        { x: 25, y: 240 },
        { x: 65, y: 240 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 0, y: 200 },
          { x: 0, y: 220 },
          { x: 150, y: 200 },
          { x: 150, y: 220 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],

    targets: 2,
    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.CONTROLIF,
      BIRD_BLOCK_TYPES.NOWORM,
    ],
    xml: compareBlockXml,
  },

  //level 7
  {
    plane: {
      cordinates: [
        { x: 230, y: 270 },
        { x: 270, y: 270 },
        { x: 230, y: 230 },
        { x: 270, y: 230 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 230, y: 70 },
        { x: 270, y: 70 },
        { x: 230, y: 30 },
        { x: 270, y: 30 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 0, y: 200 },
          { x: 0, y: 220 },
          { x: 140, y: 200 },
          { x: 140, y: 220 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 200, y: 130 },
          { x: 200, y: 150 },
          { x: 300, y: 130 },
          { x: 300, y: 150 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],

    targets: 2,

    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.CONTROLIF,
      BIRD_BLOCK_TYPES.NOWORM,
    ],
    xml: compareBlockXml,
  },

  //level 8
  {
    plane: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 230, y: 70 },
        { x: 270, y: 70 },
        { x: 230, y: 30 },
        { x: 270, y: 30 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 230, y: 270 },
        { x: 270, y: 270 },
        { x: 230, y: 230 },
        { x: 270, y: 230 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 0, y: 140 },
          { x: 0, y: 160 },
          { x: 80, y: 140 },
          { x: 80, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 140, y: 300 },
          { x: 160, y: 300 },
          { x: 140, y: 220 },
          { x: 160, y: 220 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 220, y: 140 },
          { x: 220, y: 160 },
          { x: 300, y: 140 },
          { x: 300, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 140, y: 80 },
          { x: 160, y: 80 },
          { x: 140, y: 0 },
          { x: 160, y: 0 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],

    targets: 2,

    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.CONTROLIF,
      BIRD_BLOCK_TYPES.NOWORM,
      BIRD_BLOCK_TYPES.AND,
    ],
    xml: compareBlockXml,
  },

  //level 9
  {
    plane: {
      cordinates: [
        { x: 230, y: 270 },
        { x: 270, y: 270 },
        { x: 230, y: 230 },
        { x: 270, y: 230 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 230, y: 70 },
        { x: 270, y: 70 },
        { x: 230, y: 30 },
        { x: 270, y: 30 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 220, y: 140 },
          { x: 220, y: 160 },
          { x: 300, y: 140 },
          { x: 300, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 110, y: 150 },
          { x: 130, y: 150 },
          { x: 200, y: -10 },
          { x: 210, y: 0 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 0, y: 206 },
          { x: -10, y: 223 },
          { x: 110, y: 300 },
          { x: 90, y: 300 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],
    targets: 2,
    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.CONTROLIF,
      BIRD_BLOCK_TYPES.NOWORM,
      BIRD_BLOCK_TYPES.AND,
    ],
    xml: compareBlockXml,
  },

  //level 10
  {
    plane: {
      cordinates: [
        { x: 40, y: 120 },
        { x: 80, y: 120 },
        { x: 40, y: 80 },
        { x: 80, y: 80 },
      ],
      type: "source",
      nature: "plane",
    },

    passenger: {
      cordinates: [
        { x: 240, y: 210 },
        { x: 280, y: 210 },
        { x: 240, y: 170 },
        { x: 280, y: 170 },
      ],
      type: "target",
      nature: "passenger",
    },

    airport: {
      cordinates: [
        { x: 30, y: 70 },
        { x: 70, y: 70 },
        { x: 30, y: 30 },
        { x: 70, y: 30 },
      ],
      type: "target",
      nature: "airport",
    },

    obstacles: [
      {
        cordinates: [
          { x: 200, y: 140 },
          { x: 200, y: 160 },
          { x: 300, y: 140 },
          { x: 300, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 123, y: 217 },
          { x: 133, y: 234 },
          { x: 198, y: 141 },
          { x: 200, y: 160 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
      {
        cordinates: [
          { x: 125, y: 216 },
          { x: 125, y: 234 },
          { x: 220, y: 216 },
          { x: 220, y: 234 },
        ],
        type: "obstacle",
        nature: "obstacle",
      },
    ],
    targets: 2,
    blockTypes: [
      BIRD_BLOCK_TYPES.HEADING,
      BIRD_BLOCK_TYPES.CONTROLIF,
      BIRD_BLOCK_TYPES.NOWORM,
      BIRD_BLOCK_TYPES.AND,
    ],
    xml: compareBlockXml,
  },
];
