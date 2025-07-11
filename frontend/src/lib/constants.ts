export const USER_TOKEN = 'chat:token'
export const USER_REFRESH_TOKEN = 'chat:refresh_token'

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;

export async function getJwtSecretKey() {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY?.length === 0) {
    throw new Error('A variável de ambiente JWT_SECRET_KEY não foi instanciada.')
  }

  return new TextEncoder().encode(JWT_SECRET_KEY)
}