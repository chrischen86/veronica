import { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  Conquest,
  Node,
  Phase,
  Zone,
} from 'src/conquest/interfaces/conquest.interface';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const itemTypes = ['', '', 'PHASE', '', 'ZONE', 'NODE'];
const getItemType = (sk: string) => {
  if (sk.startsWith('METADATA')) {
    return 'CONQUEST';
  }
  return itemTypes[(sk.match(/\#/g) || []).length];
};

export const parse = (
  items: {
    [key: string]: AttributeValue;
  }[],
): Conquest[] => {
  const conquestArray: Conquest[] = [];
  const phaseArray: Phase[] = [];
  const zoneArray: Zone[] = [];
  const nodeArray: Node[] = [];

  items.map((r) => {
    const itemType = getItemType(r.SK.S);
    const data = unmarshall(r);
    switch (itemType) {
      case 'CONQUEST': {
        const { id, allianceId, startDate, endDate, phases = [] } = data;
        const conquest: Conquest = {
          id,
          allianceId,
          startDate,
          endDate,
          phases,
        };
        conquestArray.push(conquest);
        break;
      }
      case 'PHASE': {
        const { id, conquestId, startDate, endDate, number, zones = [] } = data;
        const phase: Phase = {
          id,
          startDate,
          endDate,
          conquestId,
          number,
          zones,
        };
        phaseArray.push(phase);
        break;
      }
      case 'ZONE': {
        const { id, phaseId, number, orders, status, nodes = [] } = data;
        const zone: Zone = {
          id,
          phaseId,
          number,
          orders,
          status,
          nodes,
        };
        zoneArray.push(zone);
        break;
      }
      case 'NODE': {
        const { id, zoneId, number, ownerId, status } = data;
        const node: Node = {
          id,
          zoneId,
          number,
          ownerId,
          status,
        };
        nodeArray.push(node);
      }
      default:
        break;
    }
    return r;
  });

  const conquests: Conquest[] = conquestArray.map((c) =>
    parseConquest(c, phaseArray, zoneArray, nodeArray),
  );

  return conquests;
};

const parseConquest = (
  conquest: Conquest,
  phaseArray: Phase[],
  zoneArray: Zone[],
  nodeArray: Node[],
) => {
  const phases = parsePhasesByConquest(
    conquest.id,
    phaseArray,
    zoneArray,
    nodeArray,
  );
  const toReturn: Conquest = {
    ...conquest,
    phases,
  };

  return toReturn;
};

const parsePhasesByConquest = (
  conquestId: string,
  phaseArray: Phase[],
  zoneArray: Zone[],
  nodeArray: Node[],
): Phase[] => {
  const toReturn: Phase[] = phaseArray
    .filter((p) => p.conquestId === conquestId)
    .map((p) => {
      const zones = parseZonesByPhase(p.id, zoneArray, nodeArray);
      return {
        ...p,
        zones,
      };
    });

  return toReturn;
};

const parseZonesByPhase = (
  phaseId: string,
  zoneArray: Zone[],
  nodeArray: Node[],
): Zone[] => {
  const toReturn: Zone[] = zoneArray
    .filter((z) => z.phaseId === phaseId)
    .map((z): Zone => {
      const nodes = parseNodesByZone(z.id, nodeArray);
      return {
        ...z,
        nodes,
      };
    });

  return toReturn;
};

const parseNodesByZone = (zoneId: string, nodeArray: Node[]): Node[] => {
  const toReturn: Node[] = nodeArray.filter((n) => n.zoneId === zoneId);
  return toReturn;
};
