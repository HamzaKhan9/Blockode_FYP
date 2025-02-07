import { useNavigate } from "react-router-dom";
import { BsReplyFill } from "react-icons/bs";

interface BackButtonProps {
  onClick?: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();
  function clickAction() {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  }

  return (
    <button onClick={clickAction}>
      <BsReplyFill size={40} className="text-primary" />
    </button>
  );
}

export default BackButton;
