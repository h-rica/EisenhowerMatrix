import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../core/enums/user-role.enum';
import { Task } from '../../tasks/entities/task.entity';
import { Category } from '../../categories/entities/category.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ nullable: true, length: 255})
  avatar?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, length: 100 })
  @Exclude()
  emailVerificationToken?: string;

  @Column({ nullable: true })
  emailVerificationTokenExpires?: Date;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'json', nullable: true })
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
    timezone: string;
    language: string;
  };

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[]

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
}

}
