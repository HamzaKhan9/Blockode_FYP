import { useEffect, useMemo, useState } from "react";
import Blockly from "blockly/core";
import BlocklyJavaScript from "blockly/javascript";
import GameLayout from "../../layout/GameLayout";
import useWindowSize from "../../hooks/useWindowSize";
import { GAME_IDS } from "../../constants/common";
import { useParams } from "react-router-dom";
import TurtleCanva from "./components/TurtleCanva";
import { config } from "../../constants/config";
import { TURTLE_BLOCKS, TURTLE_BLOCK_TYPES } from "../../constants/turtle";

interface TurtleGamePageProps {
  showHeader?: boolean;
}

const TurtleGamePage = ({ showHeader = true }: TurtleGamePageProps) => {
  const [isBlocklyLoaded, setIsBlocklyLoaded] = useState(false);
  const { height } = useWindowSize();
  const { level = 1 } = useParams();

  useEffect(() => {
    Blockly.defineBlocksWithJsonArray(TURTLE_BLOCKS);

    BlocklyJavaScript.javascriptGenerator[TURTLE_BLOCK_TYPES.MOVE] = function (block: any) {
      return `await move('${block.getFieldValue("DIR")}',${block.getFieldValue("VALUE")});\n`;
    };

    BlocklyJavaScript.javascriptGenerator[TURTLE_BLOCK_TYPES.TURN] = function (block: any) {
      return `await ${block.getFieldValue("DIR")}(${block.getFieldValue("VALUE")});\n`;
    };

    BlocklyJavaScript.javascriptGenerator[TURTLE_BLOCK_TYPES.COLOR] = function (block: any) {
      const colour = block.getFieldValue("COLOUR");
      return `await penColor('${colour}');\n`;
    };

    BlocklyJavaScript.javascriptGenerator[TURTLE_BLOCK_TYPES.REPEAT] = function (block: any) {
      const times = `${block.getFieldValue("TIMES")}`;
      const branch = BlocklyJavaScript.javascriptGenerator.statementToCode(block, "DO");
      return `for(let n=0; n<${times}; n++) {
        ${branch}
        // HIDDEN_CODE_START
           if(!await getIsGameRunning()){
             break
           } 
        // HIDDEN_CODE_END    
          }\n
        `;
    };

    BlocklyJavaScript.javascriptGenerator[TURTLE_BLOCK_TYPES.PEN] = function (block: any) {
      return `await penDown(${block.getFieldValue("PEN") === "penDown" ? true : false});\n`;
    };

    setIsBlocklyLoaded(true);
  }, []);

  const blocklyProps = useMemo(
    () => ({
      initialXml: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="turtle_move_internal" x="10" y="10"></block>
    </xml>`,
    }),
    []
  );

  return (
    <div className="flex flex-col justify-between" style={{ height }}>
      {isBlocklyLoaded && (
        <GameLayout
          key={level || "1"}
          gameId={GAME_IDS.TURTLE}
          showHeader={showHeader}
          levelsConfig={config.turtle.levels}
          blocklyProps={blocklyProps}
          renderChildren={(code, gameProps) => <TurtleCanva code={code} animationSpeed={gameProps?.animationSpeed} />}
        />
      )}
    </div>
  );
};

export default TurtleGamePage;
