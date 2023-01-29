import express from "express";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env") });
import "./util/database.config";

import { swaggerUi } from "./util/swagger";
import api from "./routes";

const PORT = process.env.PORT || 5000;
const app = express();
const swaggerJson = require("../swagger.json");
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson))
  .use(`/${process.env.VERSION!}`, api)
  .use("*", (req, res) => {
    res.status(200).send("Route not found")
  })

app.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send("Backend of GEEPX");
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
