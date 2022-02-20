"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
class AppConfiguaration {
    constructor() {
        this.port_http = 5000;
        this.port_https = 5001;
    }
}
exports.config = new AppConfiguaration();
