import markerImg from "../assets/images/mazeImages/marker.png";

export const AVATAR_TRANISTION_DELAY = 500;

export const TURN_DIRECTIONS = [
  ["turn left", "turnLeft"],
  ["turn right", "turnRight"],
];

export const PATH_DIRECTIONS = [
  ["if path ahead", "isPathForward"],
  ["if path left", "isPathLeft"],
  ["if path right", "isPathRight"],
];

export enum MAZE_BLOCK_TYPES {
  MOVE_FORWARD = "move_forward",
  TURN = "maze_turn",
  IF = "maze_if",
  IF_ELSE = "maze_ifElse",
  FOREVER = "maze_forever",
}

export const MAZE_BLOCKS = [
  {
    type: MAZE_BLOCK_TYPES.MOVE_FORWARD,
    message0: "move forward",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Moves the character forward",
    helpUrl: "",
  },
  {
    type: MAZE_BLOCK_TYPES.TURN,
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: TURN_DIRECTIONS,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Turns the character left or right by 90 degrees.",
  },
  {
    type: MAZE_BLOCK_TYPES.IF,
    message0: `%1%2do%3`,
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: PATH_DIRECTIONS,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip:
      "If there is a path in the specified direction, then do some actions.",
  },
  {
    type: MAZE_BLOCK_TYPES.IF_ELSE,
    message0: `%1%2do%3else%4`,
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: PATH_DIRECTIONS,
      },
      {
        type: "input_dummy",
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
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip:
      "If there is a path in the specified direction, then do the first block of actions. Otherwise, do the second block of actions.",
  },
  {
    type: MAZE_BLOCK_TYPES.FOREVER,
    message0: `repeat until%1%2do%3`,
    args0: [
      {
        type: "field_image",
        src: markerImg,
        width: 12,
        height: 16,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    colour: 120,
    tooltip: "Repeat the enclosed actions forever.",
  },
];

export const MAZE_LEVELS = [
  // Level 1
  {
    map: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 3, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    blockTypes: [MAZE_BLOCK_TYPES.MOVE_FORWARD, MAZE_BLOCK_TYPES.TURN],
  },
  // Level 2
  {
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 3, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    blockTypes: [MAZE_BLOCK_TYPES.MOVE_FORWARD, MAZE_BLOCK_TYPES.TURN],
    maxBlocks: 5,
  },
  // Level 3
  {
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    blockTypes: [
      MAZE_BLOCK_TYPES.MOVE_FORWARD,
      MAZE_BLOCK_TYPES.TURN,
      MAZE_BLOCK_TYPES.FOREVER,
    ],
    maxBlocks: 2,
  },
  // Level 4
  {
    map: [
      [0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 3, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 2, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
    ],
    blockTypes: [
      MAZE_BLOCK_TYPES.MOVE_FORWARD,
      MAZE_BLOCK_TYPES.TURN,
      MAZE_BLOCK_TYPES.FOREVER,
    ],
    maxBlocks: 5,
  },
  // Level 5
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 3, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 0, 0, 2, 1, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],
  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 5,
  // },
  // // Level 6
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 1, 1, 1, 1, 0, 0],
  //     [0, 1, 0, 0, 0, 1, 0, 0],
  //     [0, 1, 1, 3, 0, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 2, 1, 1, 1, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],

  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.IF,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 5,
  // },
  // // Level 7
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 1, 0],
  //     [0, 2, 1, 1, 1, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 1, 1, 0],
  //     [0, 1, 1, 3, 0, 1, 0, 0],
  //     [0, 1, 0, 1, 0, 1, 0, 0],
  //     [0, 1, 1, 1, 1, 1, 1, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],
  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.IF,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 5,
  // },
  // // Level 8
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 1, 1, 1, 0, 0, 0],
  //     [0, 1, 0, 0, 1, 1, 0, 0],
  //     [0, 1, 1, 1, 0, 1, 0, 0],
  //     [0, 0, 0, 1, 0, 1, 0, 0],
  //     [0, 2, 1, 1, 0, 3, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],

  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.IF,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 10,
  // },
  // // Level 9
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 1, 1, 1, 1, 0, 0],
  //     [0, 0, 1, 0, 0, 0, 0, 0],
  //     [3, 1, 1, 1, 1, 1, 1, 0],
  //     [0, 1, 0, 1, 0, 1, 1, 0],
  //     [1, 1, 1, 1, 1, 0, 1, 0],
  //     [0, 1, 0, 1, 0, 2, 1, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],

  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.IF,
  //     MAZE_BLOCK_TYPES.IF_ELSE,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 7,
  // },

  // // Level 10
  // {
  //   map: [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 1, 0, 3, 0, 1, 0],
  //     [0, 1, 1, 0, 1, 1, 1, 0],
  //     [0, 1, 0, 1, 0, 1, 0, 0],
  //     [0, 1, 1, 1, 1, 1, 1, 0],
  //     [0, 0, 0, 1, 0, 0, 1, 0],
  //     [0, 2, 1, 1, 1, 0, 1, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ],
  //   blockTypes: [
  //     MAZE_BLOCK_TYPES.MOVE_FORWARD,
  //     MAZE_BLOCK_TYPES.TURN,
  //     MAZE_BLOCK_TYPES.IF,
  //     MAZE_BLOCK_TYPES.IF_ELSE,
  //     MAZE_BLOCK_TYPES.FOREVER,
  //   ],
  //   maxBlocks: 9,
  // },
];

export const MAZE_ON_BOARDING_STEPS = [
  {
    title: "ToolBox",
    target: ".blocklyFlyout",
    content: "These are the blocks you can use to create your program.",
    disableBeacon: true,
  },
  {
    title: "Workspace",
    target: ".blocklySvg",
    content: "Drag and drop the blocks here to create your program.",
  },
  {
    title: "Play/Stop Button",
    target: "#play-stop-button",
    content: "Click here to start the game or stop it.",
  },
  {
    title: "Destination",
    target: "#marker",
    content:
      "This is the final destination. You need to reach here to complete the level.",
  },
  {
    title: "Show Code Button",
    target: "#show-code-button",
    content: "Click here to see the code generated by your program.",
  },
];
