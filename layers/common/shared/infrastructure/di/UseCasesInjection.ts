import { ReadOneExample } from '../../../context/Example/application/ReadOneExample';
import { TOKENS } from '../../application/di/Tokens';
import { DependencyInjection } from './DependencyInjection';
import { ValidateUniqueExample } from '../../../context/Example/application/ValidateUniqueExample';

export const setupUseCasesInjection = () => {
  DependencyInjection.register<ReadOneExample>(TOKENS.ReadOneExample, {
    useClass: ReadOneExample,
  });

  DependencyInjection.register<ValidateUniqueExample>(
    TOKENS.ValidateUniqueExample,
    {
      useClass: ValidateUniqueExample,
    },
  );
};
