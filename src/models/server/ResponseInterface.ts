export default interface ResponseInterface {
    send(message: string|object|any[]): ResponseInterface;
    json(message: string|object|any[]): ResponseInterface;
    status(statusCode: number): ResponseInterface;
    cookie(...args): ResponseInterface;
    redirect(route: string): ResponseInterface;
}
