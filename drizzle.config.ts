import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    databaseId: process.env.DATABASE_ID as string,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
    token: process.env.CLOUDFLARE_TOKEN as string,
  },
} satisfies Config;
