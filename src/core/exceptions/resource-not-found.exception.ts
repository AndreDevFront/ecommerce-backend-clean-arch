import { DomainException } from './domain-exception';

export class ResourceNotFoundException extends DomainException {
  constructor(resource: string) {
    super(`${resource} not found.`);
  }
}
