export class ExampleDescription {
  constructor(readonly value: string) {
    if (value.length > 255) {
      throw new Error('Description must be less than 255 characters long');
    }
  }
}
