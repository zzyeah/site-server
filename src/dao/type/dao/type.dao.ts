import typeModel from "../model/type.model";
import TypeModel, { TypeAttributes } from "../model/type.model";

export class TypeDAO {
  public static instance: TypeDAO = new TypeDAO();

  public static getInstance() {
    if (!TypeDAO.instance) TypeDAO.instance = new TypeDAO();
    return TypeDAO.instance;
  }

  /**
   * 查询所有类型
   */
  public async findAllType() {
    return await typeModel.findAll();
  }

  /**
   * 新增类型
   */
  public async addType(newTypeInfo: TypeAttributes) {
    return await typeModel.create(newTypeInfo);
  }

  /**
   * 根据 id 删除类型
   */
  public async deleteType(id: string) {
    return await typeModel.destroy({
      where: {
        id,
      },
    });
  }

  /**
   * 根据 id 修改类型
   */
  public async updateType(id: string, newInfo: TypeAttributes) {
    await typeModel.update(newInfo, {
      where: {
        id,
      },
    });
    return await this.findTypeById(id);
  }

  public async findTypeById(id) {
    return await typeModel.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * 根据类型名称查找某一个类型
   */

  public async findTypeByTypeName(typeName: string) {
    return await typeModel.findOne({
      where: {
        typeName,
      },
    });
  }
}

const typeDAO = TypeDAO.getInstance();
export default typeDAO;
