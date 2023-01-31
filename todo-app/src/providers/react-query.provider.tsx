import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IWithChildren } from "../types";

export const ReactQueryProvider: React.FC<IWithChildren> = ({ children }) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 1000,
        retry: 1,
        refetchOnReconnect: true
      }
    }
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
