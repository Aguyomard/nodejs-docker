import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const doctor = await prisma.doctor.create({
    data: { email: 'test@example.com', name: 'Test doctor' },
  })

  console.log('✅ New doctor created:', doctor)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
