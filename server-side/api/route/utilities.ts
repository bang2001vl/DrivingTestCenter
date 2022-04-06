export function buildResponseError(code: number, meassage: string) {
    return {
        result: false,
        errorCode: code,
        errorMessage: meassage,
    };
}

export function buildResponseSuccess(data?: any) {
    return {
        result: true,
        data: data,
    };
}

