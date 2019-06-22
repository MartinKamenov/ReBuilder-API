export default interface ResponseInterface {
    send(message: string|object|any[]): ResponseInterface;
    json(message: string|object|any[]): ResponseInterface;
    status(statusCode: number): ResponseInterface;

    redirect(route: string): ResponseInterface;
}
