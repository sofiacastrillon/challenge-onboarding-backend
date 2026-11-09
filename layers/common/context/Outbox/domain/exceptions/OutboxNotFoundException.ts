export class OutboxNotFoundException extends Error {
  constructor(id: string) {
    super(`Outbox with id ${id} not found`);
  }
}
