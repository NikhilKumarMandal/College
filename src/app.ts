import express from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    msg: "Route not found!",
  });
});

export default app;
