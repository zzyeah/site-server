import { JwtPayload } from "jsonwebtoken";

export interface Authorization extends JwtPayload {
  id: string;
  loginId: string;
  name: string;
}
