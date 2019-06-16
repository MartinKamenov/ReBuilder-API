export default interface responseInterface {
    send(message: String): Function;
    status(statusCode: Number): Function;
};