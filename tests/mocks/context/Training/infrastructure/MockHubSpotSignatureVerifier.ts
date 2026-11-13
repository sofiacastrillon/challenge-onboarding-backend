import { HubSpotSignatureVerifier } from '../../../../../layers/common/context/Training/domain/HubSpotSignatureVerifier';

export class MockHubSpotSignatureVerifier implements HubSpotSignatureVerifier {
  public valid = true;

  async isValid(): Promise<boolean> {
    return this.valid;
  }
}
