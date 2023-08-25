/**
 * Defines and runs migrations
 */
export class Migration {
  constructor(migrationDefinition) {
    this.title = migrationDefinition.title || "Untitled migration"
    this._tester = migrationDefinition.test || ((fileJson) => false)
    this._runner = migrationDefinition.run || ((fileJson) => fileJson)
  }

  test(fileJson) {
    return this._tester(fileJson)
  }

  run(fileJson) {
    return this._runner(fileJson)
  }
  
  static runMigrations(fileJson, migrationDefinitions) {
    const migrations = migrationDefinitions.map(def => new Migration(def))
    
    let someMigrationsRan = true
    while (someMigrationsRan) {
      someMigrationsRan = false

      for (const migration of migrations) {
        if (migration.test(fileJson)) {
          console.log("Running migration:", migration.title)
          fileJson = migration.run(fileJson)
          someMigrationsRan = true
        }
      }
    }

    return fileJson
  }
}