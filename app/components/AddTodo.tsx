import {
  Dialog,
  IconButton,
  Paper,
  Slide,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState, forwardRef, ReactElement } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { collections, createTodo } from "~/utils/todos";
import { Form } from "remix";

const Transition = forwardRef(function Transition(
  { children, ...props }: { children: ReactElement },
  ref
) {
  return <Slide direction="up" ref={ref} children={children} {...props} />;
});

export function AddTodo() {
  const [text, setText] = useState("");
  const [collection, setCollection] = useState(collections[0]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setText(""); 
    setCollection(collections[0]);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Form method="post">
          <Paper elevation={2}>
            <IconButton
              edge="start"
              onClick={handleClose}
              aria-label="close"
              sx={{
                position: "fixed",
                top: 16,
                right: 16,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              height: "100%",
            }}
          >
            <input type="hidden" value={text} name="text" />
            <input type="hidden" value={collection} name="collection" />
            <TextField
              autoFocus
              sx={{
                width: "80%",
                maxWidth: "700px",
              }}
              label="What do you want to do?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="filled"
              color="primary"
            />
            <ToggleButtonGroup
              value={collection}
              exclusive
              onChange={(event, newCollection) => setCollection(newCollection)}
              aria-label="text alignment"
            >
              {collections.map((currentCollection) => (
                <ToggleButton
                  value={currentCollection}
                  aria-label={currentCollection}
                  color="secondary"
                >
                  {currentCollection}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Fab
            type="submit"
            onClick={handleClose}
            variant="extended"
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
            Create Todo
          </Fab>
        </Form>
      </Dialog>
    </>
  );
}
