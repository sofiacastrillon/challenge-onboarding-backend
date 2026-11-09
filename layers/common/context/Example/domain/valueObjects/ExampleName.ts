export class ExampleName {
  constructor(readonly value: string) {
    if (value.length > 20) {
      throw new Error('Name must be less than 20 characters long');
    }
  }
}
