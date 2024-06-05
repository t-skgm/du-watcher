import { FileMigrationProvider, Migrator } from 'kysely'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createDB } from '../code/sdk/db/createDB'

async function migrateRun(command: string) {
  if (command !== 'up' && command !== 'down') {
    throw new Error('invalid command')
  }

  const db = createDB()

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '../code/sdk/db/migrations')
    })
  })

  console.log(`[migration] ${command} starts...`)

  const { error, results } =
    command === 'up'
      ? await migrator.migrateToLatest()
      : command === 'down'
        ? await migrator.migrateDown()
        : { error: null, results: null }

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`[migration] ${command} "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(`[migration] failed to migrate ${command}`)
    console.error(error)
    process.exit(1)
  }
}

const command = process.argv[2]

await migrateRun(command)
