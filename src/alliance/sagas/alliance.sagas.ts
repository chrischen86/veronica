import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import UpdateProfileCommand from '../../auth/commands/update-profile.command';
import { AllianceCreatedEvent } from '../events/alliance-created.event';

@Injectable()
export class AllianceSagas {
  //Automatically join an alliance an user creates
  @Saga()
  allianceCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AllianceCreatedEvent),
      map((event) => {
        console.log('Inside [AllianceSagas] Saga');
        const { id, ownerId, ownerName } = event;
        return new UpdateProfileCommand(ownerId, ownerName, id);
      }),
    );
  };
}
