import Blockly from "blockly/core";
import BlocklyJavaScript from "blockly/javascript";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MAZE_BLOCKS, MAZE_BLOCK_TYPES } from "../../constants/maze";
import useWindowSize from "../../hooks/useWindowSize";
import GameLayout from "../../layout/GameLayout";
import MazeGrid from "./components/MazeGrid";
import { GAME_IDS } from "../../constants/common";
import { config } from "../../constants/config";

interface MazeGamePageProps {
  showHeader?: boolean;
}

function MazeGamePage({ showHeader = true }: MazeGamePageProps) {
  const [isBlocklyLoaded, setBlocklyLoaded] = useState(false);
  const { level = 1 } = useParams();
  const { height } = useWindowSize();

  useEffect(() => {
    Blockly.defineBlocksWithJsonArray(MAZE_BLOCKS);

    BlocklyJavaScript.javascriptGenerator[MAZE_BLOCK_TYPES.MOVE_FORWARD] =
      function () {
        return `await moveForward();\n`;
      };

    BlocklyJavaScript.javascriptGenerator[MAZE_BLOCK_TYPES.TURN] = function (
      block: any
    ) {
      return `await ${block.getFieldValue("DIR")}();\n`;
    };

    BlocklyJavaScript.javascriptGenerator[MAZE_BLOCK_TYPES.IF] = function (
      block: any
    ) {
      const argument = `${block.getFieldValue("DIR")}()`;
      const branch = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "DO"
      );
      return `if (await ${argument}) {\n${branch}}\n`;
    };

    BlocklyJavaScript.javascriptGenerator[MAZE_BLOCK_TYPES.IF_ELSE] = function (
      block: any
    ) {
      const argument = `${block.getFieldValue("DIR")}()`;
      const branch0 = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "DO"
      );
      const branch1 = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "ELSE"
      );
      return `if (await ${argument}) {\n${branch0}} else {\n${branch1}}\n`;
    };

    BlocklyJavaScript.javascriptGenerator[MAZE_BLOCK_TYPES.FOREVER] = function (
      block: any
    ) {
      let branch = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "DO"
      );
      if (BlocklyJavaScript.javascriptGenerator.INFINITE_LOOP_TRAP) {
        branch =
          BlocklyJavaScript.javascriptGenerator.INFINITE_LOOP_TRAP.replace(
            /%1/g,
            `'block_id_${block.id}'`
          ) + branch;
      }
      return `
      // HIDDEN_CODE_START
      window.lastLoc = await getLocation();
      window.lastDir = await getDirection();
      // HIDDEN_CODE_END
      
      while (!await isDone()) {
        ${branch}

        // HIDDEN_CODE_START
        const currLoc = await getLocation();
        const currDir = await getDirection();
        if (currLoc.x === lastLoc.x && currLoc.y === lastLoc.y && currDir === lastDir) {
          break;
        }
        else {
          lastLoc = currLoc;
          lastDir = currDir;
        }
        // HIDDEN_CODE_END
      }
      `;
    };
    setBlocklyLoaded(true);
  }, []);

  //avoid Blockly.inject on every render
  const blocklyProps = useMemo(
    () => ({
      initialXml: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="move_forward" x="10" y="10"></block>
    </xml>`,
    }),
    []
  );

  return (
    <div className="flex flex-col justify-between" style={{ height }}>
      {isBlocklyLoaded && (
        <GameLayout
          key={level || "1"}
          gameId={GAME_IDS.MAZE}
          levelsConfig={config.maze.levels}
          blocklyProps={blocklyProps}
          showHeader={showHeader}
          renderChildren={(code) => <MazeGrid code={code} />}
          onBoardingSteps={config.maze.onBoardingSteps}
        />
      )}
    </div>
  );
}

export default MazeGamePage;
