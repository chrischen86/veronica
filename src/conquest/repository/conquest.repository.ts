import { Injectable } from '@nestjs/common';
import { Conquest, Phase } from '../interfaces/conquest.interface';

@Injectable()
export class ConquestRepository {
  private state: Conquest = null;

  async getConquest(): Promise<Conquest> {
    return this.state;
  }

  async saveConquest(conquest: Conquest): Promise<Conquest> {
    if (this.state === null) {
      this.state = conquest;
    } else {
      this.state = {
        ...this.state,
        ...conquest,
      };
    }

    return this.state;
  }

  async savePhase(phase: Phase): Promise<Conquest> {
    this.state = {
      ...this.state,
      phases: [...this.state.phases, phase],
    };
    return this.state;
  }
}
