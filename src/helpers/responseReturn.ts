import { Response } from 'express';

type ResponseReturnType<T> = {
    statusCode?: number;
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: T | null;
};

const responseReturn = <T>(res: Response, data: ResponseReturnType<T>) => {
    const responseData: ResponseReturnType<T> = {
        statusCode: data.statusCode,
        success: data?.success,
        message: data?.message,
        meta: data?.meta,
        data: data.data,
    };
    return res.status(responseData.statusCode || 200).json(responseData);
};


export type IResponseType<T> = {
    meta?: {
        page: number,
        limit: number,
        total: number
    },
    data: T
}

export default responseReturn;
