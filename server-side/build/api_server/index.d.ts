declare function start(): void;
declare const apiServer: {
    start: typeof start;
};
export default apiServer;
