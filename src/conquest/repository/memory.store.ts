import { Conquest } from '../interfaces/conquest.interface';

export default class MemoryStore {
  private readonly map: Map<string, Conquest> = new Map();

  public get(): Map<string, Conquest> {
    return this.map;
  }
}
