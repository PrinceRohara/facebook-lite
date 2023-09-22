import SignUp from "../../components/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  });

  return (
    <div>
      <SignUp />
    </div>
  );
}
