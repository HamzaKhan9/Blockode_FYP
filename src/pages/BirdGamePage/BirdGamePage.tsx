import { useEffect, useMemo, useState } from "react";
import Blockly from "blockly/core";
import BlocklyJavaScript from "blockly/javascript";
import GameLayout from "../../layout/GameLayout";
import useWindowSize from "../../hooks/useWindowSize";
import { GAME_IDS } from "../../constants/common";
import { useParams } from "react-router-dom";
import { config } from "../../constants/config";
import { BIRD_BLOCKS, BIRD_BLOCK_TYPES } from "../../constants/bird";
import { BirdGame } from "./components/BirdGame";

interface BirdGamePageProps {
  showHeader?: boolean;
}

const BirdGamePage = ({ showHeader = true }: BirdGamePageProps) => {
  const [isBlocklyLoaded, setIsBlocklyLoaded] = useState(false);
  const { height } = useWindowSize();
  const { level = 1 } = useParams();

  useEffect(() => {
    Blockly.defineBlocksWithJsonArray(BIRD_BLOCKS);
    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.HEADING] = function (
      block: any
    ) {
      return `await updateAngle(${block.getFieldValue("ANGLE")});\n`;
    };

    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.NOWORM] =
      function () {
        return [
          "!await getIsPassengerCollided()",
          BlocklyJavaScript.javascriptGenerator.ORDER_FUNCTION_CALL,
        ];
      };

    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.IFELSE] = function (
      block: any
    ) {
      // Generate JavaScript for 'if/else' conditional.
      const argument =
        BlocklyJavaScript.javascriptGenerator.valueToCode(
          block,
          "CONDITION",
          BlocklyJavaScript.javascriptGenerator.ORDER_NONE
        ) || "false";
      const branch0 = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "DO"
      );
      const branch1 = BlocklyJavaScript.javascriptGenerator.statementToCode(
        block,
        "ELSE"
      );
      return `if (${argument}) {\n${branch0}} 
              else {
                  \n${branch1}\n
              }\n`;
    };

    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.COMPARE] = function (
      block: any
    ) {
      // Generate JavaScript for comparing bird's x or y position with a number.
      const operator = block.getFieldValue("OP") === "LT" ? "<" : ">";
      const order = BlocklyJavaScript.javascriptGenerator.ORDER_RELATIONAL;
      const argument0 =
        BlocklyJavaScript.javascriptGenerator.valueToCode(block, "A", order) ||
        "0";
      const argument1 =
        BlocklyJavaScript.javascriptGenerator.valueToCode(block, "B", order) ||
        "0";
      const code = argument0 + " " + operator + " " + argument1;
      return [code, order];
    };

    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.POSITION] =
      function (block: any) {
        // Generate JavaScript for getting bird's x or y position.
        const cordinate = block.getFieldValue("XY").charAt(0);
        const code = `await getPlanePosition('${cordinate}')`;
        return [
          code,
          BlocklyJavaScript.javascriptGenerator.ORDER_FUNCTION_CALL,
        ];
      };

    BlocklyJavaScript.javascriptGenerator[BIRD_BLOCK_TYPES.NUMBER] = function (
      block: any
    ) {
      const code = Number(block.getFieldValue("NUM"));
      const order =
        code >= 0
          ? BlocklyJavaScript.javascriptGenerator.ORDER_ATOMIC
          : BlocklyJavaScript.javascriptGenerator.ORDER_UNARY_NEGATION;
      return [code, order];
    };

    BlocklyJavaScript.javascriptGenerator["bird_and"] = function (block: any) {
      // Generate JavaScript for logical operator 'and'.
      const order = BlocklyJavaScript.javascriptGenerator.ORDER_LOGICAL_AND;
      let argument0 = BlocklyJavaScript.javascriptGenerator.valueToCode(
        block,
        "A",
        order
      );
      let argument1 = BlocklyJavaScript.javascriptGenerator.valueToCode(
        block,
        "B",
        order
      );
      if (!argument0 && !argument1) {
        // If there are no arguments, then the return value is false.
        argument0 = "false";
        argument1 = "false";
      } else {
        // Single missing arguments have no effect on the return value.
        if (!argument0) {
          argument0 = "true";
        }
        if (!argument1) {
          argument1 = "true";
        }
      }
      const code = argument0 + " && " + argument1;
      return [code, order];
    };

    // Backup the initialization function on the stock 'if' block.
    Blockly.Blocks[BIRD_BLOCK_TYPES.CONTROLIF].oldInit =
      Blockly.Blocks[BIRD_BLOCK_TYPES.CONTROLIF].init;

    /**
     * Modify the stock 'if' block to be a singleton.
     * @this {Blockly.Block}
     */
    Blockly.Blocks[BIRD_BLOCK_TYPES.CONTROLIF].init = function () {
      this.oldInit();
      this.setPreviousStatement(false);
      this.setNextStatement(false);
    };

    setIsBlocklyLoaded(true);

    return () => {
      Blockly.Blocks[BIRD_BLOCK_TYPES.CONTROLIF].init =
        Blockly.Blocks[BIRD_BLOCK_TYPES.CONTROLIF].oldInit;
    };
  }, []);

  const blocklyProps = useMemo(
    () => ({
      initialXml: `<xml xmlns="http://www.w3.org/1999/xhtml">
    </xml>`,
    }),
    []
  );

  return (
    <div className="flex flex-col justify-between" style={{ height }}>
      {isBlocklyLoaded && (
        <GameLayout
          key={level || "1"}
          gameId={GAME_IDS.BIRD}
          showHeader={showHeader}
          levelsConfig={config.plane.levels}
          blocklyProps={blocklyProps}
          renderChildren={(code) => <BirdGame code={code} />}
        />
      )}
    </div>
  );
};

export default BirdGamePage;
