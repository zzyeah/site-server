import { Model, Optional } from "sequelize";

export interface SqlBaseAttributes {
  readonly id?: string;
}

export interface SqlModelInstance<T extends SqlBaseAttributes>
  extends Model<T, Optional<T, 'id'>> {}
