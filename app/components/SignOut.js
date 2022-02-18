import React from "react";
import { signOut } from "../firebase/auth";

import Button from "@mui/material/Button";

const SignOut = (props) => (
  <>
    <Button onClick={() => signOut()} {...props}>sign out</Button>
  </>
);

export default SignOut;
