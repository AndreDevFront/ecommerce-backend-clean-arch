import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';
import { ConflictException } from 'src/core/exceptions/conflict.exception';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: CreateUserRequest): Promise<User> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await hash(password, 8);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    await this.userRepository.create(user);

    return user;
  }
}
