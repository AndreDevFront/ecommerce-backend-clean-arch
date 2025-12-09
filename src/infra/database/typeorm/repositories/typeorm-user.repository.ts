import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';
import { Repository } from 'typeorm';
import { UserSchema } from '../entities/user.schema';
import { TypeOrmUserMapper } from '../mappers/typeorm-user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private typeOrmRepo: Repository<UserSchema>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const foundUser = await this.typeOrmRepo.findOne({
      where: { id },
    });

    if (!foundUser) {
      return null;
    }

    return TypeOrmUserMapper.toDomain(foundUser);
  }

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
