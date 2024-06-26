// schemas/index.js

import 'dotenv/config';
import mongoose from "mongoose";

const databaseUrl = process.env.DB_URL;

const connect = () => {
  mongoose
    .connect(
      // 빨간색으로 표시된 부분은 대여한 ID, Password, 주소에 맞게끔 수정해주세요!
      databaseUrl,
      {
        //Studio3T에서 db 생성후 연결
        dbName: "gserver_db",
      },
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default connect;
