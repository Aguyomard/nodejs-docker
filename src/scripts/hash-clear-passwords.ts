import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function run() {
  const users = await prisma.user.findMany()

  for (const user of users) {
    const password = user.password

    if (!password || password.startsWith('$2')) continue

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    })

    console.log(`Mot de passe haché pour l'utilisateur ${user.email}`)
  }

  console.log('Tous les mots de passe en clair ont été hachés.')
  await prisma.$disconnect()
}

run().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
