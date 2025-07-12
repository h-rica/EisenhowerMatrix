import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRole } from '../../core/enums/user-role.enum';
import { QueryUsersDto } from './dto/query-users.dto';
import { PaginatedResponse } from '../../core/interfaces/paginated-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    })
    if(existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create user with default preferences
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
      preferences: {
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        timezone: 'UTC',
        language: 'en'
      }
    })

    return this.userRepository.save(user);
  }

  async findAll(queryDto: QueryUsersDto): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.userRepository.createQueryBuilder('user');
    // Apply filter
    if(search) {
      query.where(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      )
    }

    if(role) {
      query.andWhere('user.role = :role', { role });
    }

    if(isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const validSortFields = ['createdAt', 'updatedAt', 'lastLoginAt', 'email'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`user.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    // Apply pagination
    query.skip((page - 1) * limit);
    query.take(limit);
    const [users, total] = await query.getManyAndCount();
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tasks', 'categories', 'notifications']
    })

    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'isActive']
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    // Check if an email is being updated
    if(updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if(existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    // Hash new password if provided
    if(updateUserDto.password) {
      const saltRounds = 12;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      )
    }

    // Merge updates
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updatePreferences(id: string, updatePreferencesDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    // Initialize preferences if not exists
    if(!user.preferences) {
      user.preferences = {
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        timezone: 'UTC',
        language: 'en'
      }
    }
    // Merge existing preferences with updates
    user.preferences = {
      ...user.preferences,
      ...updatePreferencesDto
    };
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);

  }
}
