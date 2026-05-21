import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({ path: envPath });
