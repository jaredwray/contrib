export interface IFormError {
  [key: string]: string;
}

export interface IFormState {
  missed: string[];
  errors: IFormError;
}
