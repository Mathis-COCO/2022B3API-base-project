import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Event {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public date!: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  })
  public eventStatus?: 'Pending' | 'Accepted' | 'Declined';

  @Column({
    type: 'enum',
    enum: ['RemoteWork', 'PaidLeave'],
  })
  public eventType!: 'RemoteWork' | 'PaidLeave';

  @Column()
  public eventDescription?: string;

  @Column()
  public userId!: string;
}

export default Event;
