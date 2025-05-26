
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified auth
    navigate("/auth", { replace: true });
  }, [navigate]);

  return null;
};

export default Auth;
