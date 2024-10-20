import { AdminAttributes } from "src/dao/admin/model/admin.model";

export interface updateAdminRequest extends Partial<AdminAttributes> {
  name: string;
  loginId: string;
  loginPwd: string;
  oldLoginPwd: string;
}
