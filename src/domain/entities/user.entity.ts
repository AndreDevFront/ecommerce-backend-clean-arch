import { randomUUID } from 'crypto';

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  private _props: UserProps;

  constructor(props: UserProps) {
    this._props = {
      ...props,
      id: props.id ?? randomUUID(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this._props.id;
  }
  get name() {
    return this._props.name;
  }
  get email() {
    return this._props.email;
  }
  get password() {
    return this._props.password;
  }
  get createdAt() {
    return this._props.createdAt;
  }
  get updatedAt() {
    return this._props.updatedAt;
  }
}
