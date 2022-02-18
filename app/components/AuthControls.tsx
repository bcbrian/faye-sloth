import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Form, Link } from "remix";
import { useAuth } from "~/firebase/AuthProvider";

export default function SignInUp() {
  const user = useAuth();

  return user === null ? (
    <Box>
      <Button component={Link} to="/sign/in">
        sign in
      </Button>
      <Button
        sx={{ marginLeft: 2 }}
        component={Link}
        to="/sign/up"
        color="secondary"
      >
        sign up
      </Button>
    </Box>
  ) : (
    <Box>
      <Form action="/logout" method="post">
        <Button type="submit" color="secondary">
          sign out
        </Button>
      </Form>
    </Box>
  );
}
