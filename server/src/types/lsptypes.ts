export interface Message {
    jsonrpc: string;
}

interface RequestMessage extends Message {
    id: number | string;
    method: string;
    params?: Array<any> | object;
}

interface ResponseMessage extends Message {
    id: number | string | null;
    result?: string | number | boolean | object | null;
    error?: ResponseError<any>;
}

export namespace ErrorCodes {
    export const ParseError: number = -32700;
    export const InvalidRequest: number = -32600;
    export const MethodNotFound: number = -32601;
    export const InvalidParams: number = -32602;
    export const InternalError: number = -32603;
    export const serverErrorStart: number = -32099;
    export const serverErrorEnd: number = -32000;
    export const ServerNotInitialized: number = -32002;
    export const UnknownErrorCode: number = -32001;

    export const RequestCancelled: number = -32800;
    export const ContentModified: number = -32801;
}

interface ResponseError<D> {
    code: number;
    message: string;
    data?: D;
}

interface NotificationMessage extends Message {
    method: string;
    params?: Array<any> | object;
}

interface CancelParams {
    id: number | string;
}

interface InitializeParams {
    processId: number | null;
    rootUri: string | null;
    initializationOptions?: any;
    capabilities: {};
    trace?: 'off' | 'messages' | 'verbose';
}

