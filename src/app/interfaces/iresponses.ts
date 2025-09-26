export interface IResponse<T> {
    statusCode: number;
    isError: boolean; 
    msg: string;
    data: T; 
}
export interface TaskApiResponse<T> {
  Data: T;
  Message: string;
  Status: string;
  StatusCode: number;
}
export interface INewResponse {
    statusCode?: number;
    isError: boolean; 
    msg?: string;
    data?: any; 
}
export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  dateCreated: string;
  isActive: boolean;
  status: TaskStatus;
  priority: TaskPriority;
}
export enum TaskStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed"
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

