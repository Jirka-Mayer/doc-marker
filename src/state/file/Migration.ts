import { FileMigration } from "../../options";

/**
 * Defines and runs migrations
 */
export class Migration {
  /**
   * Human-readable title of the migration
   */
  public readonly title: string;

  private readonly tester: (fileJson: any) => boolean;
  private readonly runner: (fileJson: any) => any;

  constructor(migrationDefinition: FileMigration) {
    this.title = migrationDefinition.title || "Untitled migration";
    this.tester = migrationDefinition.test || ((fileJson: any) => false);
    this.runner = migrationDefinition.run || ((fileJson: any) => fileJson);
  }

  public test(fileJson: any) {
    return this.tester(fileJson);
  }

  public run(fileJson: any): any {
    return this.runner(fileJson);
  }

  /**
   * Executes given migrations against a given JSON file
   */
  static runMigrations(fileJson: any, migrationDefinitions: FileMigration[]) {
    const migrations = migrationDefinitions.map((def) => new Migration(def));

    let someMigrationsRan = true;
    while (someMigrationsRan) {
      someMigrationsRan = false;

      for (const migration of migrations) {
        if (migration.test(fileJson)) {
          console.log("Running migration:", migration.title);
          fileJson = migration.run(fileJson);
          someMigrationsRan = true;
        }
      }
    }

    return fileJson;
  }
}
