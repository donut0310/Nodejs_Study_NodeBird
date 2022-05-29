jest.mock("../models/users.js");
// 모킹할 모듈의 경로를 인수로 넣는다.

import { User } from "../models/users.js";
import { addFollowing } from "./user.js";

// 모킹
describe("addFollwoing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  // 테스트
  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async () => {
    // 가짜 반환값 지정 mockReturnValue
    User.findOne.mockReturnValue(
      Promise.resolve({
        addFollowing(id) {
          return Promise.resolve(true);
        },
      })
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출함", async () => {
    User.findOne.mockReturnValue(null);
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error) 호출함", async () => {
    const error = "테스트용 에러";
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
