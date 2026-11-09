export interface IResourceTags {
  ProjectName?: string;
  Project: string;
  Repository: string;
  Environment: string;
  Owner: string;
  IsCritical: 'true' | 'false';
  IsTemporal: 'true' | 'false';
  [key: string]: string | undefined;
}
