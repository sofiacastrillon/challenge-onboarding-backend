import { DynamoDBRecord } from 'aws-lambda';
import { isJson } from '../../../utils/Utils';

export default class DynamoStreamEvent {
  readonly record: DynamoDBRecord;
  readonly data: { [key: string]: any };

  constructor(record: DynamoDBRecord) {
    console.log(JSON.stringify(record));
    this.record = record;
    this.data = this.extractData(record);
  }

  /**
   * Extrae los datos del record de DynamoDB Stream
   * @param record Record de DynamoDB Stream
   * @returns Objeto con los datos extraídos
   */
  private extractData(record: DynamoDBRecord): { [key: string]: any } {
    const eventName = record.eventName;
    let data: any = {};

    switch (eventName) {
      case 'INSERT':
        data = record.dynamodb?.NewImage || {};
        break;
      case 'MODIFY':
        data = {
          old: record.dynamodb?.OldImage || {},
          new: record.dynamodb?.NewImage || {},
        };
        break;
      case 'REMOVE':
        data = record.dynamodb?.OldImage || {};
        break;
      default:
        data = record.dynamodb?.NewImage || record.dynamodb?.OldImage || {};
    }

    return this.unmarshallDynamoDBData(data);
  }

  /**
   * Convierte los datos de DynamoDB format a formato normal
   * @param data Datos en formato DynamoDB
   * @returns Datos en formato normal
   */
  private unmarshallDynamoDBData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const result: any = {};

    const entries = Object.entries(data);
    entries.forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        // Handle DynamoDB attribute value format
        if ('S' in value) {
          result[key] = value.S;
        } else if ('N' in value) {
          result[key] = Number(value.N);
        } else if ('B' in value) {
          result[key] = value.B;
        } else if ('SS' in value) {
          result[key] = value.SS;
        } else if ('NS' in value && Array.isArray(value.NS)) {
          result[key] = value.NS.map(Number);
        } else if ('BS' in value) {
          result[key] = value.BS;
        } else if ('M' in value) {
          result[key] = this.unmarshallDynamoDBData(value.M);
        } else if ('L' in value && Array.isArray(value.L)) {
          result[key] = value.L.map(
            (item: any) => this.unmarshallDynamoDBData({ temp: item }).temp,
          );
        } else if ('NULL' in value) {
          result[key] = null;
        } else if ('BOOL' in value) {
          result[key] = value.BOOL;
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Retorna los datos del evento
   * @returns {object}
   */
  getData(): { [key: string]: any } {
    return this.data;
  }

  /**
   * Retorna el tipo de evento (INSERT, MODIFY, REMOVE)
   * @returns {string}
   */
  getEventName(): string {
    return this.record.eventName || '';
  }

  /**
   * Retorna el record completo
   * @returns {DynamoDBRecord}
   */
  getRecord(): DynamoDBRecord {
    return this.record;
  }

  /**
   * Registra en los logs la salida del procesamiento de un evento
   * @param {string|number} code Codigo del mensaje
   * @param {*} message Mensaje a mostrar en los Logs
   */
  static registerOutput(code: string | number, message: any = null): void {
    console.log(
      JSON.stringify({
        code: code,
        data: message && isJson(message) ? JSON.parse(message) : message,
      }),
    );
  }
}
