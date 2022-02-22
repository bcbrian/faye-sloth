import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { requireUserId } from "~/utils/session.server";
import { addTodo, Todo, getAllNonDeletedTodos, updateTodo, deleteTodo } from "~/db/todos";
import { AddTodo } from "~/components/AddTodo";
import { Typography } from "@mui/material";
import { createTodo } from "~/utils/todos";
import { TodosContainer } from "~/components/TodoContainer";

type LoaderData = { todos: Todo[] };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const data: LoaderData = {
    todos: await getAllNonDeletedTodos(userId),
  };

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const method = form.get("_method");
  if (!method) {
    const text = form.get("text");
    const collection = form.get("collection");

    if (!text || !collection) {
      throw new Response("Could not add this todo. Please try again.", {
        status: 404,
      });
    }
    return await addTodo(
      createTodo({
        text,
        userId,
        collection,
      })
    );
  } else if (method === "put") {
    const todoId = form.get("todoId")
    return await updateTodo(todoId)
  } else if (method === "delete") {
    const todoId = form.get("todoId")
    return await deleteTodo(todoId)
  }
};

export default function DashBoard() {
  const { todos } = useLoaderData<LoaderData>();

  return (
    <Stack alignItems={"center"}>
      <Typography variant="h3" color="secondary">
        Faye Sloth: Watch your todos disappear ✨
      </Typography>

      <AddTodo />
      <TodosContainer todos={todos} />
    </Stack>
  );
}
