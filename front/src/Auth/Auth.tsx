import { useState } from "react";
import "./Auth.css";
import SignUp from "./SignUp/SignUp";
import SingIn from "./SignIn/SingIn";
import Button from "../shared/Buttons/Button";
const Auth = () => {
  const [options, setOptions] = useState<number>(0);
  return (
    <>
      <div className="container">
        {options == 0 && <SingIn />}
        {options == 1 && <SignUp />}
        <div>
          {options == 1 && <Button onClick={() => setOptions(0)}>Sing In</Button>}
          {options == 0 && <Button onClick={() => setOptions(1)}>Sing up</Button>}
        </div>
      </div>
    </>
  );
};

export default Auth;
