import { User } from 'src/domain/entities/user.entity';
import { UserSchema } from '../entities/user.schema';

export class TypeOrmUserMapper {
  static toDomain(raw: UserSchema): User {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(user: User): UserSchema {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserSchema;
  }
}
