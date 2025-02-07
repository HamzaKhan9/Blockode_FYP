import GameCardBtn from "../../components/DashboardGameCard/index";
import blocklyIcon from "../../assets/blocklyLogo.png";
import { useNavigate } from "react-router-dom";
import FunkyHeading from "../../components/FunkyHeading/FunkyHeading";
import { DASHBOARD_GAMES } from "../../constants/common";
import analytics from "../../analytics";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex flex-col items-center">
        <img src={blocklyIcon} alt="title" width={72} />
        <FunkyHeading>Blockode</FunkyHeading>
      </div>
      <div>
        <h2 className="text-md text-center text-text">
          Welcome to the world of coding!
          <br /> Games for tomorrow's programmers.
        </h2>
      </div>

      <div
        className="grid gap-4 mt-2"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(270px, 100%), 1fr))",
        }}
      >
        {DASHBOARD_GAMES.filter((item) => item.enabled).map((game, index) => (
          <GameCardBtn
            key={index}
            name={game.name}
            gameId={game.id}
            img={game.img}
            description={game.description}
            enabled={game.enabled}
            onClick={() => {
              navigate(`/games/${game.id}/levels`);
              analytics.trackEvent(`clicked_${game.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
