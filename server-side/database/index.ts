import { myPrisma, repo } from "./prisma";

export const db = {
    prisma: myPrisma,
    repository: repo
}