import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('map-message')
export class mapMessageEntity extends BaseEntity {
  
  @ManyToMany(() => MessageEntity, (message) => message.maps)
  messages: MessageEntity[];
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ default: '*' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  message_id: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
  message: mapMessageEntity;
}
