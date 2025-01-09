import {
  DataTypes,
  ModelAttributes,
  ModelOptions,
  ModelStatic,
} from "sequelize";
import sequelize from "../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "src/types";

export function createDefaultModel<T extends SqlBaseAttributes>(
  tableName: string,
  attributes: ModelAttributes<SqlModelInstance<T>, T>,
  options: ModelOptions
): ModelStatic<SqlModelInstance<T>> {
  return sequelize.define(
    tableName,
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        // defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      ...attributes,
    },
    options
  );
}
