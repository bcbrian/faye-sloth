import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

interface Props {
  children: React.ReactNode;
  leftColor?: string;
  rightColor?: string;
  sx?: object;
}
export function AppPaper({
  children,
  leftColor = "primary",
  rightColor = "secondary",
  sx = {},
}) {
  return (
    <Stack
      component={Paper}
      spacing={2}
      sx={(theme) => ({
        padding: 4,

        position: "relative",
        boxSizing: "border-box",
        backgroundClip: "padding-box",
        border: "solid 5px transparent",
        borderRadius: "1em",

        "&:before ": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -1,
          margin: "-5px",
          borderRadius: "inherit",
          background: `linear-gradient(to right, ${theme.palette[leftColor].main}, ${theme.palette[rightColor].main})`,
        },
        ...sx,
      })}
    >
      {children}
    </Stack>
  );
}
