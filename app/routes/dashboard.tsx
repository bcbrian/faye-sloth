import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { requireUserId } from "~/utils/session.server";
import { addDataPoint, DataPoint, getAllDataPoints } from "~/db/dataPoints";
import { Typography } from "@mui/material";

type LoaderData = { dataPoints: DataPoint[] };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const data: LoaderData = {
    dataPoints: await getAllDataPoints(userId),
  };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const point = Number(form.get("point"));
  const timestamp = Number(form.get("timestamp"));
  if (!point || !timestamp) {
    throw new Response("Could not add this data point. Please try again.", {
      status: 404,
    });
  }
  return await addDataPoint({
    userId,
    point,
    timestamp,
  });
};

export default function DashBoard() {
  const { dataPoints } = useLoaderData<LoaderData>();

  return (
    <Stack alignItems={"center"}>
      <Stack
        component={Paper}
        elevation={3}
        direction={"row"}
        sx={{ height: "120px", padding: "12px", margin: "12px", width: "80%" }}
        justifyContent={"space-around"}
        alignItems={"flex-end"}
      >
        {dataPoints.length ? (
          dataPoints
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ point }, i) => (
              <Box
                component={Paper}
                key={i}
                sx={{
                  height: `${point * 10}px`,
                  bgcolor: "primary.main",
                  width: `calc(100% / ${dataPoints.length} - 10px)`,
                  minWidth: "5px",
                }}
              ></Box>
            ))
        ) : (
          <Typography variant="h3">Add some data!</Typography>
        )}
      </Stack>

      <Box>
        <Form method="post">
          <input
            type="hidden"
            name="point"
            value={Math.floor(Math.random() * 10) + 1}
          />
          <input type="hidden" name="timestamp" value={Date.now()} />
          <Button type="submit" variant="contained">
            add data
          </Button>
        </Form>
      </Box>
    </Stack>
  );
}
