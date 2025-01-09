// banner 模块业务逻辑层

import validate from "validate.js";
import { Constraints } from "../types";
import { ValidationError } from "../utils/errors";
import blogDAO from "../dao/blog/dao/blog.dao";
import { TypeAttributes } from "../dao/type/model/type.model";
import typeDAO from "../dao/type/dao/type.dao";
import typeDao from "../dao/type/dao/type.dao";

class TypeService {
  public static instance: TypeService;

  public static getInstance() {
    if (!TypeService.instance) TypeService.instance = new TypeService();
    return TypeService.instance;
  }

  /**
   * 查询所有类型
   */
  public async findAllType() {
    return await typeDao.findAllType();
  }

  /**
   * 增加类型
   */
  public async addType(newTypeInfo) {
    // 首先要进行验证，查看该类型是否已经存在
    const typeRule: Constraints<TypeAttributes> = {
      typeName: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        typeIsExist: true,
      },
    };
    return validate.async(newTypeInfo, typeRule).then(
      async function () {
        return await typeDao.addType(newTypeInfo);
      },
      function () {
        return new ValidationError("数据验证失败");
      }
    );
  }

  /**
   * 根据 id 删除类型
   */
  public async deleteType(id) {
    return await typeDao.deleteType(id);
  }

  /**
   * 根据 id 修改类型
   */
  public async updateType(id, newInfo) {
    return await typeDao.updateType(id, newInfo);
  }
}

const typeService = TypeService.getInstance();
export default typeService;
