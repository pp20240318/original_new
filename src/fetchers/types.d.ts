interface PPage {
  p: number;
  p_size: number;
}

interface DPage {
  page: {
    count: number;
    num_pages: number;
    current_page: string;
  };
}
interface ReqConfig<D = any> extends RequestInit {
  baseUrl?: string;
  data?: Record<string, any>;
  options?: {
    showLoading?: boolean;
    showError?: boolean;
  };
}

type ResData<D> = D & {
  code: number;
  msg?: string;
};

type FetchOptions<A extends (...args: any[]) => Promise<any>> = Parameters<
  typeof useFetch<Awaited<ReturnType<A>>, any[]>
>[1];
