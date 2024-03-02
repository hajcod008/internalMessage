import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['system_name']) // Adding Unique constraint to system_name column
export class SYSTEM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    system_name: string;
}