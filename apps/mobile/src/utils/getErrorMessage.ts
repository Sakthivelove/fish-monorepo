import axios from "axios";

type ZodIssue = {
  path: (string | number)[];
  message: string;
};

type ZodErrorLike = {
  issues?: ZodIssue[];
};

// Shape returned by ts-rest's "combined" requestValidationErrorHandler
// when the request fails contract validation. Note: there is no
// top-level "message" field, which is why a naive error handler
// shows a generic message for these.
type CombinedValidationError = {
  pathParameterErrors?: ZodErrorLike | null;
  headerErrors?: ZodErrorLike | null;
  queryParameterErrors?: ZodErrorLike | null;
  bodyErrors?: ZodErrorLike | null;
};

function formatZodIssues(error: ZodErrorLike): string {
  return (error.issues ?? [])
    .map((issue) => {
      const field = issue.path.join(".") || "value";
      return `${field}: ${issue.message}`;
    })
    .join("\n");
}

function isCombinedValidationError(
  data: unknown
): data is CombinedValidationError {
  if (!data || typeof data !== "object") return false;
  return (
    "bodyErrors" in data ||
    "queryParameterErrors" in data ||
    "pathParameterErrors" in data ||
    "headerErrors" in data
  );
}

/**
 * Extracts a human-readable error message from an API error,
 * whether it came from axios (network/HTTP) or elsewhere.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      // Request never reached the server: wrong IP, phone not on
      // the same network, backend not running, timeout, etc.
      return `Couldn't reach the server (${error.message}). Check that your phone and the backend are on the same network.`;
    }

    const data = error.response.data as unknown;

    // ts-rest "combined" validation error (no top-level "message").
    if (isCombinedValidationError(data)) {
      const parts: string[] = [];

      if (data.bodyErrors) {
        parts.push(formatZodIssues(data.bodyErrors));
      }
      if (data.queryParameterErrors) {
        parts.push(formatZodIssues(data.queryParameterErrors));
      }
      if (data.pathParameterErrors) {
        parts.push(formatZodIssues(data.pathParameterErrors));
      }
      if (data.headerErrors) {
        parts.push(formatZodIssues(data.headerErrors));
      }

      const message = parts.filter(Boolean).join("\n");

      if (message) {
        return message;
      }
    }

    const typed = data as
      | { message?: string; error?: string }
      | undefined;

    if (typed?.message) {
      return typed.message;
    }

    if (typed?.error) {
      return typed.error;
    }

    if (typeof data === "string" && data) {
      return data;
    }

    return `Server error (${error.response.status}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
