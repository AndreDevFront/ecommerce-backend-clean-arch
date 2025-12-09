export interface SendMailProps {
  to: string;
  subject: string;
  body: string;
}

export abstract class MailGateway {
  abstract send(props: SendMailProps): Promise<void>;
}
