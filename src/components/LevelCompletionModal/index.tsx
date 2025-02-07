import { useEffect, useMemo, useRef } from "react";
import { Button, Modal } from "flowbite-react";
import { MdCheckCircleOutline } from "react-icons/md";
import GameInfoService from "../../services/gameInfo";
import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profile";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";
import { config } from "../../constants/config";

interface LevelCompletionModalProps {
  open: boolean;
  onClose?: () => void;
  level: number;
  gameId: string;
}

function LevelCompletionModal({
  open,
  onClose,
  level,
  gameId,
}: LevelCompletionModalProps) {
  // TODO
  // 1. Change logix of total levels from hardcoded to config based
  // 2. Handle onNext button on last level

  const navigate = useNavigate();
  const [profile, setProfile] = useAtom(profileAtom);
  const startTime = useRef(Date.now());
  const { width, height } = useWindowSize();

  const currentGameData = useMemo(
    () => profile?.game_info.find((info) => info.game_id === gameId),
    [profile]
  );

  useEffect(() => {
    const updateCompletedLevels = async () => {
      const duration = Date.now() - startTime.current;
      const data = await GameInfoService.upsert({
        game_id: gameId,
        profile_id: profile?.id!,
        id: currentGameData?.id,
        levels_completed: currentGameData?.levels_completed
          ? currentGameData.levels_completed.map((value, index) =>
              index === level - 1 ? true : value
            )
          : Array.from({ length: 10 }, (_, idx) => idx === level - 1),
        durations: currentGameData?.durations
          ? currentGameData.durations.map((value, index) =>
              index === level - 1 ? duration : value
            )
          : Array.from({ length: 10 }, (_, idx) =>
              idx === level - 1 ? duration : 0
            ),
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
    };

    if (open) updateCompletedLevels();
  }, [open]);

  return (
    <>
      {open ? (
        <Confetti width={width} height={height} style={{ zIndex: 99 }} />
      ) : null}
      <Modal show={open} onClose={onClose} dismissible popup size="md">
        <Modal.Header className="!border-0 !p-5" />
        <Modal.Body className="border-0">
          <div className="text-center">
            <MdCheckCircleOutline className="text-[52px] text-success m-auto mb-3" />
            <h3 className="mb-5 text-lg font-normal text-text">
              <p>
                <strong>Congratulations!</strong>{" "}
                {`You created JavaScript. Go to </> for code. Play next level.`}
              </p>
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={onClose}>
                Cancel
              </Button>
              {level < config[gameId as keyof typeof config].levels.length && (
                <Button
                  color="success"
                  onClick={() =>
                    navigate(`/games/${gameId}/levels/${level + 1}`)
                  }
                >
                  <p>Next Level</p>
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LevelCompletionModal;
