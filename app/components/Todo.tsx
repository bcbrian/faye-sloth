import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form } from "remix";
import { useRef } from "react";

export function Todo({ todo }) {
  const checkboxFormRef = useRef<HTMLFormElement | null>(null);
  const deleteFormRef = useRef<HTMLFormElement | null>(null);
  return (
    <Stack
      component={Paper}
      elevation={2}
      direction="row"
      spacing={2}
      justifyContent="space-between"
      sx={{
        maxWidth: "400px",
        padding: 1,
      }}
    >
      <Form ref={checkboxFormRef} method="post">
        <input type="hidden" value="put" name="_method" />
        <input type="hidden" value={todo.id} name="todoId" />
        <FormControlLabel
          control={
            <Checkbox
              checked={todo.isCompleted}
              onClick={(event) => {
                if (checkboxFormRef.current) {
                  checkboxFormRef.current.submit();
                }
              }}
            />
          }
          label={todo.text}
        />
      </Form>
      <Form ref={deleteFormRef} method="post">
        <input type="hidden" value="delete" name="_method" />
        <input type="hidden" value={todo.id} name="todoId" />
        <IconButton
          aria-label="delete"
          onClick={(event) => {
            if (deleteFormRef.current) {
              deleteFormRef.current.submit();
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Form>
    </Stack>
  );
}
