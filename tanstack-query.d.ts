import "@tanstack/react-query";

type Meta = { 
  errorMessage?: string;
  successMessage?: string;
  infoMessage?: string;
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: Meta;
    mutationMeta: Meta;
  }

  interface QueryOptions {
    staleTime?: number;
  }
}
