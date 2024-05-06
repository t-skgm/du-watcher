import { Result, err, ok } from 'neverthrow'

export type Env = {
  auth: string
}

export const getEnv = (): Result<Env, Error> => {
  const auth = process.env['NOTION_API_SECRET']
  if (auth == null) return err(new Error('NOTION_API_SECRET is not set'))

  return ok({ auth })
}
