type ErrorInfo =
  | {
      from: "fetch";
      error: Response;
      showError?: boolean;
    }
  | {
      from: "api";
      error: ResData<D>;
      showError?: boolean;
    }
  | {
      from: "catch";
      error: unknown;
      showError?: boolean;
    }
  | {
      from: "socket";
      error: unknown;
      showError?: boolean;
    };
