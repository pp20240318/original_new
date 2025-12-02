import { useRequest } from "ahooks";
import { UxMessage } from "../../ui";
import { initParams } from "@/initparams";

const Http = async <D>(
  url: string,
  { options, baseUrl, headers, ...customConfig }: ReqConfig<D>
): Promise<ResData<D>> => {
  // const token = "3df94d72bacbc67a917dd9fed492dafd98fdc3d4"; //getCookie(tokenKey);

  const { token } = initParams;
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ4eHhfeHh4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoibWVtYmVyIiwid2FsbGV0VHlwZSI6InRyYW5zZmVyIiwibmJmIjoxNzM3MDk5NzIyLCJleHAiOjE3MzcxMDMzMjIsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.uj7VOI3Y8nIz-SgrxMc5tXm4D8B_xNt8ktN9FLifWWM";

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  try {
    // url = url.replace("/api", `/api/${CODE}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      return Promise.reject(response);
    }

    const result = (await response.json()) as ResData<D>;

    if (result.code !== 200) {
      Promise.reject(result);
    }

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const get = <D>(
  url: string,
  { data, ...customConfig }: ReqConfig<D> = {}
) => {
  const qsData = Object.entries(data ?? {}).filter(([, v]) => v !== undefined);
  if (qsData.length) url += `?${new URLSearchParams(qsData).toString()}`;
  customConfig.method = "GET";
  return Http<D>(url, customConfig);
};

export const post = <D>(
  url: string,
  { data, ...customConfig }: ReqConfig<D> = {}
) => {
  customConfig.method = "POST";
  customConfig.body = JSON.stringify(data);
  return Http<D>(url, customConfig);
};

function isErrorFromFetch(error: unknown): error is Response {
  return error instanceof Response;
}

function isErrorFromApi<D>(error: unknown): error is ResData<D> {
  return (error as ResData<D>)?.code !== undefined;
}

export const useFetch = <D, P extends any[]>(
  ...[service, options, plugins]: Parameters<typeof useRequest<D, P>>
) => {
  // const navigate = useNavigate();
  // const toast = useToast();
  // const [, setLogin] = useLoginState();
  // const [, setSignModal] = useSignModalState();

  return useRequest<D, P>(
    service,
    {
      ...options,
      onSuccess: (data, params) => {
        options?.onSuccess?.(data, params);
      },
      onError: (error: unknown, params) => {
        console.error("error", error, params);
        if (isErrorFromApi(error)) {
          UxMessage.error(error.msg || "");
        }
      },
    },
    plugins
  );
};
