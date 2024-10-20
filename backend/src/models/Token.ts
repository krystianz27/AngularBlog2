import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import { User } from "./User";

@Table
export class Token extends Model<Token> {
  @Column({
    allowNull: false,
  })
  token?: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId?: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM("activation", "reset", "access", "refresh"),
  })
  type?: "activation" | "reset" | "access" | "refresh";

  @BelongsTo(() => User)
  user?: User;
}
