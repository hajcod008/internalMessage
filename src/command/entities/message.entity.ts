import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { mapMessageEntity } from './map-message.entity';

@Entity('message')
export class MessageEntity extends BaseEntity {
  @ManyToMany(() => mapMessageEntity, (map) => map.messages)
  maps: mapMessageEntity[];

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  system_name: string;

  @Column({ nullable: false })
  Title: string;

  @Column({ nullable: false })
  message_text: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
