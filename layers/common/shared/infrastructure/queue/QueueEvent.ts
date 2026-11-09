import { SQSRecord } from 'aws-lambda';
import { isJson } from '../../../utils/Utils';

export default class QueueEvent {
  readonly event: any;
  readonly message: { [key: string]: any };

  constructor(event: SQSRecord) {
    console.log(JSON.stringify(event));
    this.message = JSON.parse(event.body);
  }

  /**
   * Retorna el mensaje del evento
   * @returns {object}
   */
  getMessage(): { [key: string]: any } {
    return this.message;
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
