"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const prisma_1 = require("./prisma");
exports.db = {
    prisma: prisma_1.myPrisma,
    repository: prisma_1.repo
};
