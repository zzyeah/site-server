import { Model, Optional } from "sequelize";

export interface SqlBaseAttributes {
  readonly id?: number;
}

export interface SqlModelInstance<T extends SqlBaseAttributes>
  extends Model<T, Optional<T, 'id'>> {}
