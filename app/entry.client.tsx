import * as React from 'react';
import { useState } from 'react';
import { hydrate } from 'react-dom';
import { RemixBrowser } from 'remix';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';

import ClientStyleContext from '~/theme/ClientStyleContext';
import {createEmotionCache} from '~/utils/createEmotionCache';
import {theme} from '~/theme';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrate(
  <ClientCacheProvider>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </ClientCacheProvider>,
  document,
);