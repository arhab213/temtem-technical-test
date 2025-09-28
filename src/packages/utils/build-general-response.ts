export interface GeneraleResponse {
  status: true;
  code: number;
  message: string;
}

export function buildGeneralResponse(
  message: string,
  code: number,
): GeneraleResponse {
  return {
    status: true,
    code,
    message,
  };
}
