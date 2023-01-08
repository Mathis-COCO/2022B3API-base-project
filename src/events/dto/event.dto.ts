export class CreateEventDto {
  date: Date;
  eventDescription?: string;
  eventType: 'RemoteWork' | 'PaidLeave';
  userId: string;
}
