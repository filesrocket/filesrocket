import { generateRandomFilename, omitProps } from "../src/utils";

test("Generate unique filename", () => {
  const FILENAME: string = "filesrocket.png";
  const randomFilename: string = generateRandomFilename(FILENAME);
  expect(randomFilename).not.toBe(FILENAME);
});

test("Omit props of a object", () => {
  const payload = {
    fullname: "Ivan Zaldivar",
    username: "IvanZM123",
    age: 21,
    sex: "Male",
    country: "El Salvador",
    departament: "San Salvador"
  };

  const newPayload = omitProps(payload, ["sex", "departament"]);
  expect(payload).not.toBe(newPayload);
});
