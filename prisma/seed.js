import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const existingClinic = await prisma.clinic.findFirst();

    if (existingClinic) {
        console.log("Seed já executado, pulando...");
        return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const clinic = await prisma.clinic.create({
        data: {
            nome: "Cliente de Teste",
            cnpj: "12345678000100",
            email: "clinica@email.com",
            password: hashedPassword,
        }
    });

    await prisma.user.create({
        data: {
            nome: "Admin",
            email: "admin@email.com",
            password: hashedPassword,
            role: "ADMIN",
            clinic_id: clinic.id,
        }
    });

    console.log("Seed executado com sucesso!");
}

main()
.catch(console.error)
.finally(() => prisma.$disconnect());