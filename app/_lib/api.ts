export type ApiError = {
  code: string;
  message: string;
  fields?: Record<string, string>;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

const STATUS_MESSAGES: Record<number, string> = {
  400: "요청을 처리할 수 없습니다.",
  401: "로그인이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 정보를 찾을 수 없습니다.",
  409: "이미 처리된 요청입니다.",
  422: "입력값을 확인해 주세요.",
  429: "잠시 후 다시 시도해 주세요.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
};

type ServerErrorBody = {
  message?: string;
  fields?: Record<string, string>;
};

export const apiFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResult<T>> => {
  let res: Response;

  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  } catch {
    return {
      ok: false,
      error: { code: "NETWORK", message: "네트워크 연결을 확인해 주세요." },
    };
  }

  if (res.ok) {
    const data = (await res.json()) as T;
    return { ok: true, data };
  }

  let body: ServerErrorBody = {};
  try {
    body = (await res.json()) as ServerErrorBody;
  } catch {
    // ignore parse errors
  }

  // 5xx: throw so Next.js error boundaries catch it during RSC render
  if (res.status >= 500) {
    throw new Error(
      body.message ??
        STATUS_MESSAGES[res.status] ??
        "서버 오류가 발생했습니다.",
    );
  }

  return {
    ok: false,
    error: {
      code: String(res.status),
      message:
        body.message ?? STATUS_MESSAGES[res.status] ?? "오류가 발생했습니다.",
      fields: body.fields,
    },
  };
};
