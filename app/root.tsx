import {
  LoaderFunction,
  MetaFunction,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { Links, LiveReload, Outlet, useCatch, Meta, Scripts } from "remix";
import globalStylesUrl from "~/styles/global.css";
import { AuthProvider } from "~/firebase/AuthProvider";
import { Stack, ThemeProvider } from "@mui/material";
import { AppBar } from "~/components/AppBar";
import { theme } from "./theme";
import { AuthUser, getAuthUser } from "./utils/session.server";
import { AppPaper } from "./components/AppPaper";
import { Typography } from "@mui/material";
import { CacheProvider, withEmotionCache } from "@emotion/react";
import { createEmotionCache } from "~/utils/createEmotionCache";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import { useContext } from "react";
import ClientStyleContext from "~/theme/ClientStyleContext";
import { height } from "@mui/system";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
  ];
}

export const meta: MetaFunction = () => {
  const description = `Code Sagas is a place to learn a million and one ways to code.`;
  return {
    description,
    keywords: "code,sagas,learn",
    "twitter:image": "https://codesagas.com/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@codesagas",
    "twitter:site": "@codesagas",
    "twitter:title": "Code Sagas",
    "twitter:description": description,
  };
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

type LoaderData = { user: AuthUser | null };

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthUser(request);

  const data: LoaderData = {
    user,
  };
  return data;
};

const cache = createEmotionCache();
function Providers({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  return (
    <AuthProvider user={user}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </AuthProvider>
  );
}

export default function App() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <Document>
      <Providers user={user}>
        <AppBar />
        <Outlet />
      </Providers>
    </Document>
  );
}

function RootError({
  docTitle = "Oops!",
  title = "Something went wrong. 😥",
  message = "Please try again later.",
}) {
  return (
    <Document title={docTitle}>
      <ThemeProvider theme={theme}>
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ height: "100vh", padding: 5 }}
        >
          <AppPaper leftColor="error" rightColor="warning">
            <Typography variant="h1" textAlign="center">
              {title}
            </Typography>
            <Typography>{message}</Typography>
          </AppPaper>
        </Stack>
      </ThemeProvider>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const title = `${caught.status} ${caught.statusText}`;
  return (
    <RootError
      docTitle={title}
      title={title}
      message={
        "Well this is embarsing. 😅 Have you tried turning it off and back on again?"
      }
    />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <RootError message={error.message} />;
}
