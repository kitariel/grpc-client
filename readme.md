# XState Template Module

## Description

A Template Spawnable/Invokable XState state-machine.

## Context

```typescript
import { AnyEventObject } from 'xstate';
import { Client, ClientDuplexStream } from '@grpc/grpc-js'; // grpc has been deprecated

export type IDuplexStream = ClientDuplexStream<IMessage, IMessage>;

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
}

export interface IModuleData {
  client?: Client | undefined;
  stream?: ClientDuplexStream<IMessage, IMessage> | undefined;
  attempts: number;
  buffer: any[];
}

export interface IModuleEnvelope {
  created_date: string; //Date<ISOString>
  updated_date: string; //Date<ISOString>
}

export interface INameEnvelope extends IModuleEnvelope {
  module_name: 'GRPC_CLIENT';
  client_id: string;
}

export interface IContext {
  config: IModuleConfig;
  data: IModuleData;
}
```

## Module Events

Interact with an instance of this machine with the following events.

```typescript
// parent machine to this module.
export interface ISend<TPayload = AnyEventObject> {
  type: 'SEND';
  payload: TPayload;
}

// This module to parent machine. Sent when config.transparent = false
export interface IMessage<TPayload = AnyEventObject> {
  type: 'MESSAGE';
  payload: TPayload;
}

// This module to parent machine. Sent when config.transparent = true
export interface IMachineEvents extends AnyEventObject {}

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
  error: Error;
}
```
