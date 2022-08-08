import { AnyEventObject } from 'xstate';
import { Client, ClientDuplexStream } from '@grpc/grpc-js';
export interface IMachineEvents extends AnyEventObject {}
export declare type IDuplexStream = ClientDuplexStream<IMessage, IMessage>;
export interface IRecord<TEntry> {
  [key: string]: TEntry;
}
export interface IAES_256_CBC_CIPHER_PARAMS {
  encryption_key: string;
  encryption_iv: string;
}
export interface IModuleConfig {
  port: number;
  host: string;
  transparent?: boolean;
  verbose?: boolean;
  encryption?: IAES_256_CBC_CIPHER_PARAMS;
  max_pings: number;
}
export interface IModuleData {
  client?: Client;
  stream?: ClientDuplexStream<IMessage, IMessage> | undefined;
  attempts: number;
  buffer: any[];
  ping_counter: number;
}
export interface IModuleEnvelope {
  created_date: string;
  updated_date: string;
  client_id: string;
}
export interface IContext {
  config: IModuleConfig;
  data?: IModuleData;
}
export interface PayloadType extends AnyEventObject {
  envelope: IModuleEnvelope;
}
export interface ISend<TPayload = PayloadType> {
  type: 'SEND';
  client_id: string;
  payload: TPayload;
}
export interface IMessage<TPayload = PayloadType> {
  type: 'MESSAGE';
  client_id: string;
  payload: TPayload;
}
export interface INameEnvelope extends IModuleEnvelope {
  module_name: 'GRPC_CLIENT';
  client_id: string;
}
export interface IToParentMessage {
  type: string;
  client_id: string;
}
export interface IConnectionClosedEvent {
  type: 'CONNECTION_CLOSED';
  client_id: string;
}
export interface ICloseConnectionEvent {
  type: 'CLOSE_CONNECTION';
  client_id: string;
}
export interface IClientCreated {
  type: 'CLIENT_CREATED';
  payload: Client;
}
export interface IStreamCreated {
  type: 'STREAM_CREATED';
  payload: IDuplexStream;
}
export interface IErrorEvent {
  type: 'ERROR';
  error: Error | null;
}
//# sourceMappingURL=types.d.ts.map
