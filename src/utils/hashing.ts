import bcrypt from 'bcryptjs'

export async function doHashing(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    console.error('Erreur lors du hashage :', error)
    throw new Error('Impossible de hasher le mot de passe')
  }
}
