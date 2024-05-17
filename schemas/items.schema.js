//몽구스의 기능 가져오기
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  item_number: {
    type: Number, //숫자
    required: true, //필수 항목
  },
  item_name: {
    type: String,
    required: true, // value 필드는 필수 요소입니다.
  },
  item_stats: {
    health: { type: Number },
    power: { type: Number },
  },
});

export default mongoose.model("Item", ItemSchema);
