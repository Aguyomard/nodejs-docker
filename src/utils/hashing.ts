import bcrypt from 'bcryptjs'
import crypto from 'crypto'

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

export async function hmacHashing(value: string, key: string): Promise<string> {
  try {
    return crypto.createHmac('sha256', key).update(value).digest('hex')
  } catch (error) {
    console.error('Erreur lors du hashage HMAC :', error)
    throw new Error('Impossible de générer le hash HMAC')
  }
}

export async function hmacCompare(
  value: string,
  hash: string,
  key: string
): Promise<boolean> {
  try {
    const generatedHash = await hmacHashing(value, key)
    return hash === generatedHash
  } catch (error) {
    console.error('Erreur lors de la comparaison HMAC :', error)
    throw new Error('Impossible de comparer les hash HMAC')
  }
}
