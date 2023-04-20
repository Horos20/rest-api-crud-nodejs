-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" SERIAL NOT NULL,
    "employee_name" TEXT NOT NULL,
    "employee_salary" INTEGER NOT NULL,
    "employee_age" INTEGER NOT NULL,
    "profile_image" TEXT NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);
