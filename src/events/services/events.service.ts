import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../events.entity';
import { CreateEventDto } from '../dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventsRepository.findOne({ where: { id: id } });
  }

  async findByDateAndUserId(date: Date, userId: string): Promise<Event> {
    return this.eventsRepository.findOne({
      where: {
        date,
        userId,
      },
    });
  }

  async countRemoteWorkByUserId(userId: string): Promise<number> {
    return this.eventsRepository.count({
      where: {
        eventType: 'RemoteWork',
        userId,
      },
    });
  }

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    let event = new Event();
    event.date = createEventDto.date;
    event.eventDescription = createEventDto.eventDescription;
    event.eventType = createEventDto.eventType;
    event.userId = userId;
    let event1 = this.eventsRepository.create(event);
    return this.eventsRepository.save(event1);
  }

  async update(event: Event): Promise<Event> {
    return this.eventsRepository.save(event);
  }
}
