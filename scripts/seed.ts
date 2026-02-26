import { prisma } from "../src/services/prisma";

async function main() {
  await prisma.taxEngineVersion.create({
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
    await prisma.$disconnect();
  });
