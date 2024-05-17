//express 사용을 위한
import express from "express";
//스키마
import Item from "../schemas/items.schema.js";
//router에 express.Router 할당
import joi from "joi";

//router에 express.Router 미들웨어 할당
const router = express.Router();

//joi schema
const createdItemSchema = joi.object({
  item_name: joi.string().min(2).max(20).required(),
  health: joi.number(),
  power: joi.number(),
});
const createdItemSchema2 = joi.object({
  item_number: joi.number(),
  item_name: joi.string().min(2).max(20),
  health: joi.number(),
  power: joi.number(),
});

// ! 아이템 생성 api
router.post("/items", async (req, res, next) => {
  try {
    const validation = await createdItemSchema.validateAsync(req.body);

    const { item_name, health, power } = validation;

    // 이름입력 확인
    if (!item_name) {
      return res
        .status(400)
        .json({ errorMessage: "입력된 아이템 이름(item_name)이 없습니다." });
    }
    //db에 접근하여 await .exec
    //유저 아이디중 가장 높은 숫자를 구하여 userMaxId.
    const itemMaxNumber = await Item.findOne().sort("-item_number").exec();

    //item_id 변수에 만약 itemMaxId가 존재한다면 거기 1 더하고 아니면 1로 할당
    const item_number = itemMaxNumber ? itemMaxNumber.item_number + 1 : 1;
    const item_stats = {
      health: health,
      power: power,
    };

    //db에 body.req에서 가져온 이름, 힘, 체력을 설정해서 바인딩
    const item = new Item({ item_number, item_name, item_stats });
    //db에 저장
    await item.save();
    //5. character를 클라이언트에게 반환 201 = 자원생성 성공
    return res.status(201).json({ item: item });
  } catch (error) {
    //에러 발생시, 에러 출력
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(404).json({ errorMessage: error.message });
    }
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

//! 아이템 수정 api
router.patch("/items/:itemId", async (req, res, next) => {
  try {
    const validation = await createdItemSchema2.validateAsync(req.body);

    const { itemId } = req.params;

    const { item_name, health, power } = validation;

    const currentItem = await Item.findById(itemId).exec();

    if (!currentItem) {
      return res
        .status(404)
        .json({ errorMessage: "존재하지 않는 아이템입니다." });
    }

    if (item_name !== undefined) {
      currentItem.item_name = item_name;
    }
    if (health !== undefined) {
      currentItem.item_stats.health = health;
    }
    if (power !== undefined) {
      currentItem.item_stats.power = power;
    }
    await currentItem.save();
    return res.status(200).json({ item: currentItem });
  } catch (error) {
    //에러 발생시, 에러 출력
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(404).json({ errorMessage: error.message });
    }
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

//! 아이템 조회 api
router.get("/items", async (req, res, next) => {
  try {
    const items = await Item.find()
      .sort("-item_number")
      .select("item_name item_number")
      .exec();
    return res.status(200).json({ items });
  } catch (error) {
    //에러 발생시, 에러 출력
    console.error(error);
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

//! 아이템 상세보기 api
router.get("/items/:itemId", async (req, res, next) => {
  // 일단 필요한 변수 선언
  try {
    const { itemId } = req.params;
    const currentItem = await Item.findById(itemId)
      .select("item_stats item_number item_name")
      .exec();

    //오류 걸러내기
    if (!currentItem) {
      return res
        .status(400)
        .json({ errorMessage: "입력된 아이템 넘버의 아이템은 없습니다." });
    }

    // item Response 를 객체화 해서 id를 뺴고 출력
    const itemRes = currentItem.toObject();
    delete itemRes._id;
    //핵심 로직 후 return or next
    return res.status(200).json({ currentItem: itemRes });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

export default router;
