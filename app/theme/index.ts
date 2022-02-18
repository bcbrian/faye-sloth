import { createTheme } from "@mui/material";
import { COLORS } from "~/theme/colors";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: COLORS.PRIMARY,
    },
    secondary: {
      main: COLORS.SECONDARY,
    },
    error: {
      main: COLORS.ERROR,
    },
    warning: {
      main: COLORS.WARNING,
    },
    info: {
      main: COLORS.INFO,
    },
    success: {
      main: COLORS.SUCCESS,
    },
    background: {
      default: COLORS.BACKGROUND.DEFAULT,
      paper: COLORS.BACKGROUND.PAPER,
    },
  },
  components: {
    // Name of the component ⚛️
    MuiButtonBase: {
      defaultProps: {
        // The default props to change
        disableRipple: true, // No more ripple, on the whole application 💣!
        // variant: "outlined",
      },
    },
    MuiButton: {
      defaultProps: {
        // The default props to change
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
        },
      },
    },
  },
});