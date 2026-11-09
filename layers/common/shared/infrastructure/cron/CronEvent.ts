import { isJson } from '../../../utils/Utils';

export default class CronEvent {
  readonly event: any;

  constructor(event: any) {
    console.log(JSON.stringify(event));
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
