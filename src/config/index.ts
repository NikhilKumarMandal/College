import { config } from "dotenv";

config();

const { PORT, NODE_ENV, ACCESS_TOKEN_SECRET } = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
};
