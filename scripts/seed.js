"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/services/prisma");
async function main() {
    await prisma_1.prisma.taxEngineVersion.create({
        data: {
            name: "Engine v1",
            description: "PF x PJ (Lucro Presumido) - modelo base"
        }
    });
    console.log("✔ TaxEngineVersion v1 criada");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
