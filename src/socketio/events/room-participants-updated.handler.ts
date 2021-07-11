import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { SocketioGateway } from '../socketio.gateway';
import { RoomParticipantsUpdatedEvent } from './room-participants-updated.event';

@EventsHandler(RoomParticipantsUpdatedEvent)
export class RoomParticipantsUpdatedEventHandler
  implements IEventHandler<RoomParticipantsUpdatedEvent>
{
  constructor(private readonly websocketGateway: SocketioGateway) {}

  async handle(event: RoomParticipantsUpdatedEvent) {
    console.log('RoomParticipantsUpdatedEvent Socket Handler...');
    const { conquestId } = event;

    const participants = await this.getRoomParticipants(conquestId);
    this.websocketGateway.server
      .to(conquestId)
      .emit('PlayersUpdated', participants);
  }

  async getRoomParticipants(roomNumber) {
    const connected = await this.websocketGateway.server
      .in(roomNumber)
      .fetchSockets();
    const players = connected
      .map((s) => {
        return { name: s.data.userName, id: s.data.userId };
      })
      .filter((p, i, a) => a.findIndex((f) => f.id === p.id) === i);

    return players;
  }
}
