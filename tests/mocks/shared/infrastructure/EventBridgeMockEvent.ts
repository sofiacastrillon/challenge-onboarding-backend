import { v7 } from 'uuid';
import { EventBridgeEvent } from 'aws-lambda';

export interface EventBridgeMockEventDetail {
  [key: string]: any;
}

export interface EventBridgeMockConfig {
  source?: string;
  detailType?: string;
  detail?: EventBridgeMockEventDetail;
  resources?: string[];
}

export const EventBridgeMockEvent = ({
  source = 'custom.app',
  detailType = 'Custom Event',
  detail = {},
  resources = [],
}: EventBridgeMockConfig): EventBridgeEvent<
  string,
  EventBridgeMockEventDetail
> => {
  return {
    id: v7(),
    version: '0',
    account: '123456789012',
    time: new Date().toISOString(),
    region: 'us-east-1',
    source,
    'detail-type': detailType,
    detail,
    resources,
  };
};
