import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/modules/Routes";
import apiNotFoundErrorHandler from "./app/apiNotFoundErrorHandler/apiNotFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("server running smoothly");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(apiNotFoundErrorHandler);

export default app;
