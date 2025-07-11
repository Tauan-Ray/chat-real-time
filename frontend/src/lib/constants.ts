export const USER_TOKEN = 'chat:token'
export const USER_REFRESH_TOKEN = 'chat:refresh_token'

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export async function getJwtSecretKey() {
  if (!JWT_SECRET || JWT_SECRET?.length === 0) {
    throw new Error('A variável de ambiente JWT_KEY não foi instanciada.')
  }

  return new TextEncoder().encode(process.env.JWT_SECRET)
}