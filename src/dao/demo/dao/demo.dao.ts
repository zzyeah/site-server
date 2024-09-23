import { DemoAttributes } from "../../../types";
import DemoModel from "../model/demo.model";

export class DemoDAO {
  public static instance: DemoDAO = new DemoDAO();

  public static getInstance() {
    if (!DemoDAO.instance) DemoDAO.instance = new DemoDAO();
    return DemoDAO.instance;
  }

  // 查询所有的项目
  async findAllDemo() {
    return await DemoModel.findAll();
  }

  // 新增项目
  async addDemo(newDemoInfo: DemoAttributes) {
    return await DemoModel.create(newDemoInfo);
  }

  // 更新项目
  async updateDemo(id: string, newDemoInfo: DemoAttributes) {
    await DemoModel.update(newDemoInfo, { where: { id } });
    return await DemoModel.findByPk(id);
  }

  async deleteDemo(id: string) {
    const result = await DemoModel.destroy({ where: { id } });
    return result > 0;
  }
}

const demoDAO = DemoDAO.getInstance();
export default demoDAO;
