import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskPriority } from '../../../core/enums/task-priority.enum';
import { TaskStatus } from '../../../core/enums/task-status.enum';
import { Category } from '../../categories/entities/category.entity';

@Entity('tasks')
@Index(['userId', 'priority', 'status', 'dueDate'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NOT_URGENT_NOT_IMPORTANT
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  estimatedDuration?: number; // in minutes

  @Column({ nullable: true })
  actualDuration?: number; // in minutes

  @Column({ nullable: true })
  order?: number; // for sorting within quadrants

  @Column({ type: 'json', nullable: true })
  tags?: string[]

  @Column({ nullable: true, length: 255 })
  delegateTo?: string;

  @Column({ nullable: true })
  delegatedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[]

  @Column({ type:'json', nullable: true })
  reminders?: {
    id: string;
    dateTime: Date;
    sent: boolean
  }[]

  @Column({ default: true })
  isRecurring: boolean;

  @Column({ type: 'json', nullable: true })
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  }

  @Column({ nullable: true })
  parentTaskId?: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (category) => category.tasks, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isOverdue(): boolean {
    return this.dueDate && this.dueDate < new Date() && this.status !== TaskStatus.COMPLETED;
  }

  get quadrantLabel(): string {
    switch (this.priority) {
      case TaskPriority.URGENT_IMPORTANT: { return 'Do it'; }
      case TaskPriority.NOT_URGENT_IMPORTANT: { return 'Schedule it'; }
      case TaskPriority.URGENT_NOT_IMPORTANT: { return 'Delegate it'; }
      case TaskPriority.NOT_URGENT_NOT_IMPORTANT: { return 'Delete it'; }
      default: { return 'Do it'; }
    }
  }

  get quadrantColor(): string {
    switch (this.priority) {
      case TaskPriority.URGENT_IMPORTANT: { return '#D4F6D4'; } // Light green
      case TaskPriority.NOT_URGENT_IMPORTANT: { return '#FFE4CC'; } // Light orange
      case TaskPriority.URGENT_NOT_IMPORTANT: { return '#FFF9C4'; } // Light yellow
      case TaskPriority.NOT_URGENT_NOT_IMPORTANT: { return '#FFCCCB'; } // Light red
      default: { return '#3B82F6'; } // Blue
    }
  }
}
