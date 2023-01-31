export interface ICreateTodo {
  name: string;
  description: string;
  finishDate: Date;
}

export class CreateTodoModel implements ICreateTodo {
  name: string;
  description: string;
  finishDate: Date;
}
