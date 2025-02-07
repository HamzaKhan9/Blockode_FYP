import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import locale from "blockly/msg/en";
import "blockly/blocks";
import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import { Block } from "../components/Blockly";
import BlocklyTheme from "../constants/config/WorkspaceTheme";
import Header from "../components/Header";
import { GAME_IDS } from "../constants/common";
import { BiCodeAlt } from "react-icons/bi";
import SourceCodeModal from "../components/SourceCodeModal";
import { dispatchMessage, filterHiddenCodeAndAwait } from "../utils/miscUtils";
import { Button } from "flowbite-react";
import OnBoardInstructions from "../components/OnBoardInstructions";
import { profileAtom } from "../atoms/profile";
import { useAtom } from "jotai";
import GameInfoService from "../services/gameInfo";
import { Slider } from "../components/Slider/Slider";
import { useIsWebview } from "../hooks/useIsWebview";
import { useLocalStorage } from "usehooks-ts";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";

Blockly.setLocale(locale);

export interface BlocklyComponentProps {
  initialXml?: string;
  [key: string]: any;
}

interface LayoutProps {
  gameId: GAME_IDS;
  levelsConfig: any; // levelsConfig is an array of objects, each object has a property called maxBlocks
  blocklyProps: BlocklyComponentProps;
  renderChildren: (
    code: string,
    gameProps?: Record<string, any>
  ) => JSX.Element;
  onBoardingSteps?: any;
  showHeader?: boolean;
}

function GameLayout({
  gameId,
  levelsConfig,
  blocklyProps,
  renderChildren,
  onBoardingSteps,
  showHeader = true,
}: LayoutProps) {
  const { level = 1 } = useParams();
  const [profile, setProfile] = useAtom(profileAtom);
  const currentGameData = useMemo(
    () => profile?.game_info.find((info) => info.game_id === gameId),
    [profile]
  );
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const toolbox = useRef<HTMLDivElement>(null);
  const [isWebView] = useIsWebview();
  const primaryWorkspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [blocksCount, setBlocksCount] = useState(0);
  const maxBlocks = levelsConfig[Number(level) - 1]?.maxBlocks || 0;
  const blocksLeft = maxBlocks - blocksCount;
  const [code, setCode] = useState<string>("");
  const { height } = useWindowSize();
  const [levelWorkspace, setLevelWorkspace] = useLocalStorage(
    "levelWorkspace",
    {} as Record<string, any>
  );
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [showOnBoarding, setShowOnBoarding] = useState<boolean>(
    currentGameData?.onboarding_completed ? false : true
  );

  useEffect(() => {
    const { initialXml, ...rest } = blocklyProps;
    if (blocklyDiv.current && toolbox.current) {
      const configXML = levelsConfig[+level - 1].xml || "";
      if (configXML) {
        toolbox.current.innerHTML =
          toolbox.current.innerHTML + "\n" + configXML;
      }
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
        horizontalLayout: true,
        toolboxPosition: "end",
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.9,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true,
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        move: {
          scrollbars: true,
          drag: true,
          wheel: true,
        },
        ...rest,
        maxBlocks,
        theme: BlocklyTheme,
      });

      if (initialXml) {
        Blockly.Xml.domToWorkspace(
          Blockly.utils.xml.textToDom(initialXml),
          primaryWorkspace.current
        );
      }
    }
  }, [blocklyProps, level]);

  useEffect(() => {
    const generateCode = (): void => {
      if (primaryWorkspace.current) {
        const code = javascriptGenerator.workspaceToCode(
          primaryWorkspace.current
        );
        setCode(code);
      }
    };
    const workspace = Blockly.getMainWorkspace(); // Get your Blockly workspace.
    setBlocksCount(workspace.getAllBlocks(true).length);
    if (workspace && levelWorkspace) {
      if (levelWorkspace[gameId] && levelWorkspace[gameId][level])
        Blockly.serialization.workspaces.load(
          levelWorkspace[gameId][level],
          workspace
        );
    }

    workspace.addChangeListener((event: Blockly.Events.Abstract) => {
      if (
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_CHANGE
      ) {
        setBlocksCount(workspace.getAllBlocks(true).length);
        setLevelWorkspace((prevState) => {
          if (!prevState) {
            prevState = {};
          }
          if (!prevState[gameId]) prevState[gameId] = {};
          prevState[gameId][level] =
            Blockly.serialization.workspaces.save(workspace);
          return prevState;
        });
      }
    });

    if (primaryWorkspace.current) {
      primaryWorkspace.current.addChangeListener(generateCode);
    }
    return () => {
      if (primaryWorkspace.current) {
        primaryWorkspace.current.removeChangeListener(generateCode);
      }
    };
  }, []);

  const handleOnBoardingCompleted = async () => {
    setShowOnBoarding(false);
    if (!isWebView) {
      const data = await GameInfoService.upsert({
        game_id: gameId,
        profile_id: profile?.id!,
        id: currentGameData?.id,
        onboarding_completed: true,
      });
      setProfile((profile) => {
        let newProfile = { ...profile };
        if (profile) {
          newProfile.game_info = profile?.game_info || [];
          const indx = profile.game_info.findIndex(
            (info) => info.game_id === gameId
          );
          if (indx !== -1) {
            newProfile.game_info[indx] = data;
          } else {
            newProfile.game_info.push(data);
          }
        }
        return newProfile as typeof profile;
      });
    } else {
      dispatchMessage("onboarding-completed");
    }
  };

  const handleAnimationSpeed = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnimationSpeed(+e.target.value);
    },
    []
  );

  return (
    <>
      <div className="pt-6 px-6">
        <OnBoardInstructions
          run={showOnBoarding}
          steps={onBoardingSteps}
          callback={(data: { action: string }) => {
            if (data.action === "reset") handleOnBoardingCompleted();
          }}
        />
        {showHeader ? (
          <Header
            backLink={`/games/${gameId}/levels`}
            onShowHelp={() => setShowOnBoarding(true)}
          />
        ) : null}
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {renderChildren(code, { animationSpeed })}
      </ErrorBoundary>
      <div
        ref={blocklyDiv}
        id="blocklyDiv"
        className="w-screen relative"
        style={{ height: height * 0.4 }}
      >
        {maxBlocks ? (
          <span className="z-30 absolute top-[-28px] left-[2px] rounded-full px-2 py-px">
            <p
              className={`font-semibold text-sm ${
                blocksLeft === 0 ? "text-danger" : "text-textLight"
              }`}
            >
              Blocks left: <strong>{blocksLeft}</strong>
            </p>
          </span>
        ) : null}
        <Button
          onClick={() => setShowCodeModal(true)}
          size="xs"
          id="show-code-button"
          className="z-30 absolute top-[-43px] right-[10px] px-0 py-0"
          gradientMonochrome="info"
        >
          <BiCodeAlt className="text-[24px]" />
        </Button>
        {gameId === "turtle" ? (
          <Slider
            handler={handleAnimationSpeed}
            max={1000}
            min={0}
            step={250}
            value={animationSpeed}
          />
        ) : null}
      </div>
      <div style={{ display: "none" }} ref={toolbox}>
        {levelsConfig[+level - 1]?.blockTypes.length
          ? levelsConfig[+level - 1]?.blockTypes.map(
              (type: React.Key | null | undefined) => (
                <Block type={type} key={type} />
              )
            )
          : null}
      </div>
      <SourceCodeModal
        code={filterHiddenCodeAndAwait(code)}
        open={showCodeModal}
        onClose={() => setShowCodeModal(false)}
      />
    </>
  );
}

export default GameLayout;
