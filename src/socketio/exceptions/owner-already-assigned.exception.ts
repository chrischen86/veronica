import { WsException } from '@nestjs/websockets';

export class OwnerAlreadyAssignedWsException extends WsException {
  constructor(message: string) {
    super(message);
  }

  getError() {
    return {
      status: 'warn',
      message: this.message,
    };
  }
}
