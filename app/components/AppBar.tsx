import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AuthControls from "~/components/AuthControls";
import Typography from "@mui/material/Typography";

export function AppBar() {
  return (
    <>
      <MuiAppBar>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={(theme) => ({
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              textFillColor: "transparent",
            })}
          >
            FAYE SLOTH
          </Typography>

          <AuthControls />
        </Toolbar>
      </MuiAppBar>
      <Box sx={{ marginBottom: "64px" }} />
    </>
  );
}
