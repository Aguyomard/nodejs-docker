import bcrypt from 'bcryptjs'

export async function doHashing(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    console.error('Erreur lors du hashage :', error)
    throw new Error('Impossible de hasher le mot de passe')
  }
}

export async function compareHash(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Erreur lors de la comparaison :', error)
    throw new Error('Impossible de comparer les mots de passe')
  }
}
