import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async delete(userId: number): Promise<void> {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('User not found or already deleted');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  
}

