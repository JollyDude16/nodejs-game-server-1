//router, schema, express, prettier, yarn
import express from "express";
import connect from "./schemas/index.js";
import charactersRouter from "./routes/characters.router.js";
import itemsRouter from "./routes/items.router.js";
// import characterRouter from "./routes/character.router.js";

//app 변수로 express 미들웨어에 접근
const app = express();

//port 설정
const PORT = 3000;

//app.js 실행시 Mongoose서버에 연결
connect();

//express 툴 전역 사용
app.use(express.json());

//req.body 데이터를 가져올 수 있게 해주는 미들웨어
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.use("/api", [router, charactersRouter, itemsRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가열렸어요!");
});
