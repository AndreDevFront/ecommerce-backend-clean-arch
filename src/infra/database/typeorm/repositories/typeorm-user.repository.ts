import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';
import { User } from 'src/domain/entities/user.entity';
import { UserSchema } from '../entities/user.schema';
import { TypeOrmUserMapper } from '../mappers/typeorm-user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private typeOrmRepo: Repository<UserSchema>,
  ) {}

  async create(user: User): Promise<void> {
    const data = TypeOrmUserMapper.toPersistence(user);
    const created = this.typeOrmRepo.create(data);
    await this.typeOrmRepo.save(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.typeOrmRepo.findOne({
      where: { email },
    });

    if (!found) {
      return null;
    }

    return TypeOrmUserMapper.toDomain(found);
  }
}
