export interface SuccessResponseWithData<T> {
  status: boolean;
  code: number;
  message: string;
  data: T[];
}

export function buildSuccessResponseWithData<T>(
  data: T,
  statusCode: number,
  message: string,
): SuccessResponseWithData<T> {
  return {
    status: true,
    code: statusCode,
    message: message,
    data: Array.isArray(data) ? data : [data],
  };
}
