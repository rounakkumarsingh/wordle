export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    errors: string[];
    stack?: string;
}
