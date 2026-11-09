class ApiClientException extends Error {
  constructor(
    readonly message: any,
    readonly code: any,
  ) {
    super(message);
  }
}

export default ApiClientException;
