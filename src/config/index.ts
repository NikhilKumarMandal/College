import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const { PORT, NODE_ENV, ACCESS_TOKEN_SECRET, MONGO_URI, REFRESH_TOKEN_SECRET } =
  process.env;

export const Config = {
  PORT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  MONGO_URI,
  REFRESH_TOKEN_SECRET,
};
