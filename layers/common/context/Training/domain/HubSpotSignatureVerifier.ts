export interface HubSpotSignedRequest {
  requestMethod: string;
  requestUri: string;
  requestBody: string;
  requestTimestamp: string;
  signature: string;
}

export interface HubSpotSignatureVerifier {
  isValid(request: HubSpotSignedRequest): Promise<boolean>;
}
