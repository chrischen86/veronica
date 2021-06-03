import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import SetupPhaseCommand from '../commands/setup-phase.command';
import { ConquestCreatedEvent } from '../events/conquest-created.event';

@Injectable()
export class ConquestSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ConquestCreatedEvent),
      delay(1000),
      map((event) => {
        console.log('Inside [ConquestSagas] Saga');
        return new SetupPhaseCommand(
          1,
          event.startDate,
          event.endDate,
          event.conquestId,
        );
      }),
    );
  };
}
