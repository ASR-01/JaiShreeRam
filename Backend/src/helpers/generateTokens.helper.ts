import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
const generateToken = (id: string, expiresIn: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn });
};

export default generateToken;
