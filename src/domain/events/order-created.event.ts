export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly clientEmail: string,
    public readonly totalAmount: number,
  ) {}
}
