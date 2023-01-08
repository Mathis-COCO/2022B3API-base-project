import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BeforeInsert, OneToOne, ManyToOne } from 'typeorm';
import { Project } from '../projects/entity/project.entity';
import { User } from '../users/entity/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  public id!: string; //au format uuidv4

  @Column({ type: "date", nullable: false })
  public date!: Date;

  @Column({ default: 'Pending' })
  public eventStatus?: 'Pending' | 'Accepted' | 'Declined' // valeur par défaut : 'Pending';

  @Column()
  public eventType!: 'RemoteWork' | 'PaidLeave';

  @Column({ type: "string" })
  public eventDescription?: string;

  @Column({ type: "uuid" })
  public userId!: string; //au format uuidv4
}
