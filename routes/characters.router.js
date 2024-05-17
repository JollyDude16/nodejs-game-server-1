//express 사용을 위한
import express from "express";
//스키마
import Character from "../schemas/characters.schema.js";
//router에 express.Router 할당
import joi from "joi";

const router = express.Router();

//joi 스키마
const createdCharacterSchema = joi.object({
  name: joi.string().min(2).max(20).required(),
});

// ! 캐릭터 생성 api
router.post("/characters", async (req, res, next) => {
  //req.body.name 을 객체 구조 분해 할당
  try {
    const validation = await createdCharacterSchema.validateAsync(req.body);

    const { name } = validation;

    // 이름입력 확인
    if (!name) {
      return res
        .status(400)
        .json({ errorMessage: "입력된 이름(name)이 없습니다." });
    }
    //db에 접근하여 await .exec
    //유저 아이디중 가장 높은 숫자를 구하여 userMaxId.
    const characterMaxId = await Character.findOne()
      .sort("-character_id")
      .exec();

    //character_id 변수에 만약 characterMaxId가 존재한다면 거기 1 더하고 아니면 1로 할당
    const character_id = characterMaxId ? characterMaxId.character_id + 1 : 1;
    const health = 500;
    const power = 100;

    //db에 body.req에서 가져온 이름, 500체력, 힘 100을 설정해서 바인딩
    const character = new Character({ character_id, name, health, power });
    //db에 저장
    await character.save();
    //5. character를 클라이언트에게 반환 201 = 자원생성 성공
    return res.status(201).json({ character: character });
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

//! 삭제 api
router.delete("/characters/:characterId", async (req, res, next) => {
  try {
    //캐릭터 id 파라그램을 캐릭터 아이디에 저장
    const { characterId } = req.params;

    const character = await Character.findOne({
      character_id: characterId,
    }).exec();
    //에러!
    if (!character) {
      return res
        .status(404)
        .json({ errorMesseage: "캐릭터를 찾지 못했습니다." });
    }
    await Character.deleteOne({ character_id: characterId });
    return res.status(200).json({ message: "캐릭터가 삭제되었습니다!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

// ! 캐릭터 조회 api
router.get("/characters", async (req, res, next) => {
  try {
    const characters = await Character.find().sort("-character_id").exec();
    return res.status(200).json({ characters });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생되었습니다." });
  }
});

export default router;
