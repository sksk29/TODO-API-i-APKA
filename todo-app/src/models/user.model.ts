export interface IUser {
  id: string;
  auth0Id: string;
  email: string;
  emailVerified: boolean;
  nickname: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel implements IUser {
  public id: string;
  public auth0Id: string;
  public email: string;
  public emailVerified: boolean;
  public nickname: string;
  public picture: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data?: IUser) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
