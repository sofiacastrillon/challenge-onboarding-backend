import { CdkLess } from '@alegradev/cdkless';
import * as dotenv from 'dotenv';
import { initializeAuthorizer } from './Authorizer';
import { Training } from './resources/Training';
import { Env } from '../layers/common/shared/domain/interfaces/IEnvironment';
import { getEnv } from '../layers/common/utils/Utils';
import { PROJECT_NAME } from './constants';

export {
  PROJECT_NAME,
  CURRENT_API_VERSION,
  LAMBDAS_BASE_PATH,
} from './constants';

dotenv.config();

const app = new CdkLess({
  appName: PROJECT_NAME,
  settings: {
    defaultTags: {
      Project: PROJECT_NAME,
      ProjectName: PROJECT_NAME, // Para los proyectos que ya usaban ProjectName, para no perder el historico del cost explorer
      Repository:
        'https://github.com/sofiacastrillon/challenge-onboarding-backend',
      Environment: getEnv(Env.STAGE, 'development'),
      Owner: 'Ledger', // Validar en https://opsless.alegra.com/ el nombre del owner
      IsCritical: 'true',
      IsTemporal: 'false',
    },
  },
});

initializeAuthorizer(app);

app.setSharedLayer('dist/layers/common', {
  layerVersionName: `${PROJECT_NAME}-common-layer`,
});

Training.build(app);
