"use client";

import { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { tsr } from "@/lib/tsr";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnWindowFocus: false,
      },

      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient:
  | QueryClient
  | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient =
      makeQueryClient();
  }

  return browserQueryClient;
}

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>
        {children}
      </tsr.ReactQueryProvider>

      <ReactQueryDevtools
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}