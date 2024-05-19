import { Result } from 'neverthrow'
import path from 'path'

export const saveToFileAction = Result.fromThrowable(async ({ text, filePath }: { text: string; filePath: string }) => {
  const savePath = path.resolve(import.meta.dir, '../../', filePath)
  console.log(`[saveToFile] save to ${savePath}`)
  await Bun.write(savePath, text)
})
