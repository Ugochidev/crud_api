import express from "express";
import dotenv from "dotenv";
dotenv.config();

import userRouter from "./routes/userRoute.js"

const app = express();
const port = process.env.PORT

app.use(express.json());

app.get('/', (_, res) =>{
	res.send("Hello World!!!");
})

app.use("/api/v1/users", userRouter);

app.listen(port, () => {
	console.log(`App listening on port: http://localhost:${port}`);
});