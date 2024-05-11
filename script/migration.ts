import { FileMigrationProvider, Migrator } from 'kysely'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createDB } from '../code/sdk/db/createDB'

async function migrateToLatest() {
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

  console.log('migration starts...')

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }
}

await migrateToLatest()
