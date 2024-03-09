import { Demo } from "../../model";
import { CommonRequest } from "../common";

export interface AddDemoRequest extends CommonRequest {
  body: Demo;
}
