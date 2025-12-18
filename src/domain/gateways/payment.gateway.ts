export interface PaymentInput {
  customerId: string;
  orderId: string;
  amount: number;
  paymentMethod: 'pix' | 'card';
  customerEmail: string;
}

export interface PaymentOutput {
  transactionId: string;
  status: string;
  clientSecret?: string;
  pixQrCodeUrl?: string;
  pixCopyPaste?: string;
}

export abstract class PaymentGateway {
  abstract createTransaction(input: PaymentInput): Promise<PaymentOutput>;
}
