import { ExampleStatusValue } from '../IExample';

export class ExampleStatus {
  constructor(readonly value: ExampleStatusValue) {
    if (!Object.values(ExampleStatusValue).includes(value)) {
      throw new Error('Invalid example status');
    }
  }
}
