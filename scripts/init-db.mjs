import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = resolve(projectRoot, 'database', 'schema.sql');
const seedPath = resolve(projectRoot, 'database', 'seed.sql');
export const defaultDatabasePath = resolve(projectRoot, 'database', 'pixelvault.sqlite');

export function initializeDatabase(databasePath = defaultDatabasePath) {
  const resolvedDatabasePath = resolve(databasePath);
  const stagingPath = `${resolvedDatabasePath}.building-${process.pid}`;

  mkdirSync(dirname(resolvedDatabasePath), { recursive: true });
  rmSync(stagingPath, { force: true });

  let database;
  try {
    database = new DatabaseSync(stagingPath);
    database.exec('PRAGMA foreign_keys = ON;');
    database.exec(readFileSync(schemaPath, 'utf8'));
    database.exec(readFileSync(seedPath, 'utf8'));

    const foreignKeyViolations = database.prepare('PRAGMA foreign_key_check').all();
    if (foreignKeyViolations.length > 0) {
      throw new Error(`Banco gerado com ${foreignKeyViolations.length} violação(ões) de chave estrangeira.`);
    }

    database.close();
    database = undefined;
    rmSync(resolvedDatabasePath, { force: true });
    renameSync(stagingPath, resolvedDatabasePath);
    return resolvedDatabasePath;
  } catch (error) {
    database?.close();
    rmSync(stagingPath, { force: true });
    throw error;
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const generatedPath = initializeDatabase();
    const size = existsSync(generatedPath) ? 'criado' : 'não encontrado';
    console.log(`Banco SQLite ${size}: ${generatedPath}`);
  } catch (error) {
    console.error(`Falha ao inicializar o banco SQLite: ${error.message}`);
    process.exitCode = 1;
  }
}
