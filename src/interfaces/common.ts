import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    total: number;
    limit: number;
  };
  data: T | null;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IPaginatinQuery = {
  page: number;
  limit: number;
  filter?: Record<string, unknown>;
  search?: string;
  sort?: string;
  select?: string;
};
