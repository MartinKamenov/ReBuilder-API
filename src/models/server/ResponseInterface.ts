export default interface ResponseInterface {
    send(message: String|Object|Array<any>): ResponseInterface;
    status(statusCode: Number): ResponseInterface;
};