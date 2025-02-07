import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect({ link }: { link: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(link, { replace: true });
  }, []);

  return null;
}

export default Redirect;
