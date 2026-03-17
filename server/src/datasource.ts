import { DataSource } from "typeorm";

const isJestRuntime = process.env.JEST_WORKER_ID !== undefined;

const datasource = new DataSource({
  type: "better-sqlite3",
  database: isJestRuntime ? ":memory:" : "./db.sqlite",
  entities: ["./src/entities/**/*.{js,ts}"],
  logging: !isJestRuntime,
  synchronize: true,
});

export default datasource;
