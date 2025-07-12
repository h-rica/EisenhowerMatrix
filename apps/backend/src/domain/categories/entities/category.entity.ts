import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('categories')
@Index(['userId'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: boolean;

  @Column({ length: 7, default: '#3B82F6' })
  color: string; // Hex color code

  @Column({ nullable: true, length: 100 })
  icon?: string; // Icon name or emoji

  @Column({ default: 0 })
  order: number; // for sorting categories

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get tasksCount(): number {
    return this.tasks?.length || 0;
  }
}
