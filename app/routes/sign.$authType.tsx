import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import { useActionData, json, useSearchParams, Link } from "remix";
import { createUserSession, login, register } from "~/utils/session.server";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { AppPaper } from "~/components/AppPaper";

export const meta: MetaFunction = () => {
  return {
    title: "Faye Sloth | Sign In",
    description: "Sign in to get things done!",
  };
};

export const AUTH_TYPES = {
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
};

type LoaderData = { authType: string };

export const loader: LoaderFunction = async ({ request, params }) => {
  const data: LoaderData = {
    authType:
      params.authType === "in" ? AUTH_TYPES.SIGN_IN : AUTH_TYPES.SIGN_UP,
  };

  return data;
};

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `Emails must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    authType: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const authType = form.get("authType");
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/dashboard";
  if (
    typeof authType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { authType, email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (authType) {
    case AUTH_TYPES.SIGN_IN: {
      const user = await login({ email, password });
      if (!user || !user.email) {
        return badRequest({
          fields,
          formError: `Email/Password combination is incorrect`,
        });
      }
      const userToken = await user.getIdToken();
      return createUserSession(userToken, redirectTo);
    }
    case AUTH_TYPES.SIGN_UP: {
      // if (userExists) {
      //   return badRequest({
      //     fields,
      //     formError: `User with email ${email} already exists`,
      //   });
      // }
      const user = await register({ email, password });
      if (!user || !user.email) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      const userToken = await user.getIdToken();
      return createUserSession(userToken, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const { authType: initAuthType } = useLoaderData<LoaderData>();
  console.log(initAuthType);

  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  const [authType, setAuthType] = useState(initAuthType);

  const handleAuthType = (event, newAuthType) => {
    if (!newAuthType) return;
    setAuthType(newAuthType);
  };

  useEffect(() => {
    if (initAuthType !== authType) {
      setAuthType(initAuthType);
    }
  }, [initAuthType]);
  return (
    <>
      <Stack
        sx={{
          maxWidth: "500px",
          margin: "200px auto",
        }}
      >
        <AppPaper>
          <Typography variant="h1" textAlign={"center"}>
            {authType}
          </Typography>
          <Form
            method="post"
            aria-describedby={
              actionData?.formError ? "form-error-message" : undefined
            }
          >
            <Stack component={Paper} spacing={2}>
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get("redirectTo") ?? undefined}
              />
              <input type="hidden" name="authType" value={authType} />
              <ToggleButtonGroup
                value={authType}
                exclusive
                onChange={handleAuthType}
                aria-label="Sign In or Sign Up"
                color="secondary"
                fullWidth
              >
                <ToggleButton
                  value={AUTH_TYPES.SIGN_IN}
                  aria-label={AUTH_TYPES.SIGN_IN}
                  color="primary"
                >
                  Sign In
                </ToggleButton>
                <ToggleButton
                  value={AUTH_TYPES.SIGN_UP}
                  aria-label={AUTH_TYPES.SIGN_UP}
                >
                  Sign Up
                </ToggleButton>
              </ToggleButtonGroup>

              <div>
                <TextField
                  label="Email"
                  variant="filled"
                  fullWidth
                  color={
                    authType === AUTH_TYPES.SIGN_IN ? "primary" : "secondary"
                  }
                  id="email-input"
                  name="email"
                  defaultValue={actionData?.fields?.email}
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  aria-describedby={
                    actionData?.fieldErrors?.email
                      ? "email-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.email ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="email-error"
                  >
                    {actionData?.fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <TextField
                  label="Password"
                  variant="filled"
                  fullWidth
                  color={
                    authType === AUTH_TYPES.SIGN_IN ? "primary" : "secondary"
                  }
                  id="password-input"
                  name="password"
                  defaultValue={actionData?.fields?.password}
                  type="password"
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.password) || undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />

                {actionData?.fieldErrors?.password ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="password-error"
                  >
                    {actionData?.fieldErrors.password}
                  </p>
                ) : null}
              </div>
              <div id="form-error-message">
                {actionData?.formError ? (
                  <p className="form-validation-error" role="alert">
                    {actionData?.formError}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                variant="contained"
                size="large"
                color={
                  AUTH_TYPES.SIGN_IN === authType ? "primary" : "secondary"
                }
              >
                {authType}
              </Button>
            </Stack>
          </Form>
        </AppPaper>
      </Stack>
    </>
  );
}
