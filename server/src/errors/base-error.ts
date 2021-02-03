export class BaseError extends Error {
  protected identifier: string;

  constructor(message?: string, identifier?: string) {
    super(message);
    this.identifier = identifier || 'base_error';
  }

  getIdentifier(): string {
    return this.identifier;
  }
}
