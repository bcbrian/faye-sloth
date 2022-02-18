import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MetaFunction } from "remix";
import { Link } from "remix";
import { AppPaper } from "~/components/AppPaper";

export const meta: MetaFunction = () => {
  return {
    title: "Code Sagas: Copy/Pasta/Twerk",
    description: "Codes Sagas a place to learn a million and one ways to code.",
  };
};

export default function Index() {
  return (
    <Stack
      sx={{
        maxWidth: "700px",
        margin: "80px auto",
        width: "80%",
      }}
    >
      <AppPaper>
        <Typography variant="h3" textAlign={"center"}>
          Learning to code simplified and with some humor.
        </Typography>
        <Button component={Link} to="/sign/in" size={"large"} variant={"contained"}>SIGN IN</Button>
      </AppPaper>
    </Stack>
  );
}
