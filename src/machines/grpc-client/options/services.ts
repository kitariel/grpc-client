import { ServiceConfig, Sender, AnyEventObject, send } from 'xstate';
import { IContext, IMachineEvents } from '../types';
import { createClient } from '../../../util';
import { IRecord, IClientCreated, IStreamCreated, IErrorEvent } from '../types';

const { RECONNECT_WAIT_MS = '10000', HEARTBEAT_MS = '5000' } = process.env;
const error_log = (error: Error) => {
  console.log(`[${new Date().toISOString()}]`, error);
};
const services: IRecord<ServiceConfig<IContext, IMachineEvents>> = {
  createGRPCCLient: ({ config: { host, port } }) => (
    send: Sender<IClientCreated | IStreamCreated | IErrorEvent>
  ) => {
    try {
      const client = createClient(`${host}:${port}`);
      send({
        type: 'CLIENT_CREATED',
        payload: client,
      });
    } catch (error) {
      error_log(error);
    }
  },
  initializedGRPCStream: ({ data }) => (
    send: Sender<IClientCreated | IStreamCreated | IErrorEvent>
  ) => {
    try {
      const { client } = data!;
      const waitTime = parseInt(RECONNECT_WAIT_MS);
      const unix_time_now = new Date().getTime();
      const unix_time_wait = unix_time_now + waitTime;

      client?.waitForReady(
        unix_time_wait,
        (error: Error | null | undefined) => {
          if (!error) {
            //@ts-ignore
            const stream = client?.startConnection();

            send({
              type: 'STREAM_CREATED',
              payload: stream,
            });
          }
          send({
            type: 'ERROR',
            error: error as Error,
          });
        }
      );
    } catch (error) {
      error_log(error);
    }
  },
  loadServices: ({ data }) => (send) => {
    try {
      const { client, stream } = data!;

      stream?.on('data', send);
      stream?.on('error', (error: any) => {
        if (error.code === 2) {
          client?.close();
          send({
            type: 'CONNECTION_CLOSED',
          });
        } else {
          send({
            type: 'ERROR',
            error,
          });
        }
      });

      return () => stream?.removeListener('data', send);
    } catch (error) {
      error_log(error);
    }
  },
  onEventHandlerHeartBeat: (c, e) => (send, onEvent) => {
    try {
      const { stream } = c.data!;

      const handler = (event: any) => {
        let interval: any = setInterval(() => {
          stream?.write({
            ...event, // client_id
            type: 'HEARTBEAT',
          });

          send({
            type: 'INCREMENT_PING',
          });
        }, Number(HEARTBEAT_MS));
        return () => {
          clearInterval(interval);
        };
      };
      onEvent(handler);
    } catch (error) {
      error_log(error);
    }
  },
  unloadEnqueuedMessages: ({ data }) => (send) => {
    try {
      const { buffer } = data!;
      let item = buffer.shift();
      while (item) {
        send(item);
        item = buffer.shift();
      }
    } catch (error) {
      error_log(error);
    }
  },
};

export default services;
