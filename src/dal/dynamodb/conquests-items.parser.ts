import { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  Conquest,
  Node,
  Phase,
  Zone,
} from '../../conquest/interfaces/conquest.interface';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const itemTypes = ['', '', 'PHASE', '', 'ZONE', 'NODE'];
const getItemType = (sk: string) => {
  if (sk.startsWith('METADATA')) {
    return 'CONQUEST';
  }
  return itemTypes[(sk.match(/\#/g) || []).length];
};

export const parseConquest = (
  items: {
    [key: string]: AttributeValue;
  }[],
): Conquest[] => {
  const { conquestArray, phaseArray, zoneArray, nodeArray } = parse(items);
  const conquests: Conquest[] = conquestArray.map((c) =>
    buildConquest(c, phaseArray, zoneArray, nodeArray),
  );
  return conquests;
};

export const parsePhase = (
  conquestId: string,
  items: {
    [key: string]: AttributeValue;
  }[],
): Phase[] => {
  const { phaseArray, zoneArray, nodeArray } = parse(items);
  const phases: Phase[] = buildPhasesByConquest(
    conquestId,
    phaseArray,
    zoneArray,
    nodeArray,
  );

  return phases;
};

export const parseZone = (
  phaseId: string,
  items: {
    [key: string]: AttributeValue;
  }[],
): Zone[] => {
  const { zoneArray, nodeArray } = parse(items);
  const zones: Zone[] = buildZonesByPhase(phaseId, zoneArray, nodeArray);
  return zones;
};

export const parseNode = (
  zoneId: string,
  items: {
    [key: string]: AttributeValue;
  }[],
): Node[] => {
  const { nodeArray } = parse(items);
  const nodes: Node[] = buildNodesByZone(zoneId, nodeArray);
  return nodes;
};

const buildConquest = (
  conquest: Conquest,
  phaseArray: Phase[],
  zoneArray: Zone[],
  nodeArray: Node[],
) => {
  const phases = buildPhasesByConquest(
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

const buildPhasesByConquest = (
  conquestId: string,
  phaseArray: Phase[],
  zoneArray: Zone[],
  nodeArray: Node[],
): Phase[] => {
  const toReturn: Phase[] = phaseArray
    .filter((p) => p.conquestId === conquestId)
    .map((p) => {
      const zones = buildZonesByPhase(p.id, zoneArray, nodeArray);
      return {
        ...p,
        zones,
      };
    })
    .sort((a, b) => (b.startDate > a.startDate ? -1 : 1));

  return toReturn;
};

const buildZonesByPhase = (
  phaseId: string,
  zoneArray: Zone[],
  nodeArray: Node[],
): Zone[] => {
  const toReturn: Zone[] = zoneArray
    .filter((z) => z.phaseId === phaseId)
    .map((z): Zone => {
      const nodes = buildNodesByZone(z.id, nodeArray);
      return {
        ...z,
        nodes,
      };
    })
    .sort((a, b) => a.number - b.number);

  return toReturn;
};

const buildNodesByZone = (zoneId: string, nodeArray: Node[]): Node[] => {
  const toReturn: Node[] = nodeArray
    .filter((n) => n.zoneId === zoneId)
    .sort((a, b) => a.number - b.number);
  return toReturn;
};

const parse = (
  items: {
    [key: string]: AttributeValue;
  }[],
) => {
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

  return { conquestArray, phaseArray, zoneArray, nodeArray };
};
