import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, mergeMap, map } from 'rxjs/operators';
import CreateNodeCommand from '../commands/create-node.command';
import SetupPhaseCommand from '../commands/setup-phase.command';
import { NODES } from '../constants';
import { ConquestCreatedEvent } from '../events/conquest-created.event';
import { ZoneCreatedEvent } from '../events/zone-created.event';
import { NodeStatus } from '../interfaces/conquest.interface';
import { getPhases } from './phase.helper';

@Injectable()
export class ConquestSagas {
  @Saga()
  conquestCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ConquestCreatedEvent),
      map((event) => {
        console.log('Inside [ConquestSagas] Saga');

        const phases = getPhases(event.startDate, event.endDate);
        return phases.map(
          (p) =>
            new SetupPhaseCommand(
              p.phase,
              p.startDate,
              p.endDate,
              event.conquestId,
            ),
        );
      }),
      mergeMap((c) => c),
    );
  };

  @Saga()
  zoneCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ZoneCreatedEvent),
      map((event) => {
        console.log('Inside [ZoneCreated] Saga');

        const { conquestId, zone, holds } = event;

        return NODES.map(
          (n) =>
            new CreateNodeCommand(
              conquestId,
              zone.phaseId,
              zone.id,
              n,
              holds.indexOf(n) >= 0 ? NodeStatus.OPEN : NodeStatus.HOLD,
            ),
        );
      }),
      mergeMap((c) => c),
    );
  };
}
