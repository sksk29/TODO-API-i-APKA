export interface ITodo {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  finishDate: string;
  isFinished: boolean;
}

export class TodoModel implements ITodo {
  public id: string;
  public createdAt: string;
  public updatedAt: string;
  public name: string;
  public description: string;
  public finishDate: string;
  public isFinished: boolean;

  constructor(data?: ITodo) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
