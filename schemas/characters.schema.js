//몽구스의 기능 가져오기
import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  character_id: {
    type: Number, //숫자
    required: true, //필수 항목
    unique: true, //중복 없게
  },
  name: {
    type: String,
    required: true, // value 필드는 필수 요소입니다.
  },
  health: {
    type: Number, // doneAt 필드는 Date 타입을 가집니다.
    required: true, // doneAt 필드는 필수 요소가 아닙니다.
  },
  power: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Character", CharacterSchema);
