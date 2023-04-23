const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
async function main() {
  const user1 = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: "Jack",
    },
  });
  const user2 = await prisma.users.upsert({
    where: { id: 2 },
    update: {},
    create: {
      username: "John",
    },
  });
  const workers1 = await prisma.workers.upsert({
    where: { id: 1 },
    update: {},
    create: {
      employee_name: "Tom",
      employee_salary: 45000,
      employee_age: 20,
      profile_image: "",
      owner_id: null
    },
  });
  const workers2 = await prisma.workers.upsert({
    where: { id: 2 },
    update: {},
    create: {
      employee_name: "Jerry",
      employee_salary: 52000,
      employee_age: 29,
      profile_image: "",
      owner_id: null
    },
  });
  const workers3 = await prisma.workers.upsert({
    where: { id: 3 },
    update: {},
    create: {
      employee_name: "Annie",
      employee_salary: 37000,
      employee_age: 23,
      profile_image: "",
      owner_id: null
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
