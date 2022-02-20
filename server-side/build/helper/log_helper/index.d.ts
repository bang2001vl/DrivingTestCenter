declare class AppLogger {
    trace(msg: String): void;
    traceWithTag(msg: String, tag: String): void;
    error(msg: String): void;
    errorWithTag(msg: String, tag: String): void;
}
declare let logger: AppLogger;
export default logger;
