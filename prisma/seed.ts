import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Crear Tenant por defecto
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Empresa Demo',
      slug: 'empresa-demo',
    },
  });

  // Encriptar contraseña para el usuario
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Crear Usuario Administrador ligado al Tenant
  const user = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      name: 'Admin Usuario',
      password: hashedPassword,
      tenantId: tenant.id,
    },
  });

  console.log('🌱 Datos de prueba insertados con éxito:');
  console.log({ tenant, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });