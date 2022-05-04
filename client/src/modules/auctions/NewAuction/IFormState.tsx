interface IFormError {
  [key: string]: string;
}

interface IFormState {
  missed: string[];
  errors: IFormError[];
}

export default IFormState;
