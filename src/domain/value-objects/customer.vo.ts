export class Customer {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _address: string;
  private readonly _city: string;
  private readonly _zipCode: string;

  constructor(
    name: string,
    email: string,
    address: string,
    city: string,
    zipCode: string,
  ) {
    this.validate(name, email);

    this._name = name;
    this._email = email;
    this._address = address;
    this._city = city;
    this._zipCode = zipCode;
  }

  private validate(name: string, email: string) {
    if (!name || name.length < 2) {
      throw new Error('Customer name is invalid');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Customer email is invalid');
    }
  }

  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get address(): string {
    return this._address;
  }
  get city(): string {
    return this._city;
  }
  get zipCode(): string {
    return this._zipCode;
  }
}
