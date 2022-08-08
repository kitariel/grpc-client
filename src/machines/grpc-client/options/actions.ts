import {
  ActionFunctionMap,
  assign,
  AnyEventObject,
  sendParent,
  send,
} from 'xstate';
import {
  IContext,
  IClientCreated,
  IStreamCreated,
  ISend,
  IMessage,
  PayloadType,
} from '../types';
import {
  encrypt,
  decrypt,
  deserializeFromJSON,
  serializeToJSON,
} from '../../../util';
// import { Client, ClientDuplexStream } from "@grpc/grpc-js";
import logger from './logger';
const error_log = (error: Error) => {
  console.log(`[${new Date().toISOString()}]`, error);
};

const actions: ActionFunctionMap<IContext, any> = {
  ...logger,
  incrementConnectionAttempts: assign((context) => {
    const new_data = context.data!;
    return {
      data: {
        ...new_data,
        attempts: ++new_data.attempts,
      },
    };
  }),
  assignClientToContext: assign((context, { payload }: IClientCreated) => {
    const new_data = context.data!;
    return {
      data: {
        ...new_data,
        client: payload,
      },
    };
  }),
  assignStreamToContext: assign((context, { payload }: IStreamCreated) => {
    const new_data = context.data!;
    return {
      data: {
        ...new_data,
        stream: payload,
      },
    };
  }),
  enqueueMessage: ({ data }, event) => {
    const { buffer } = data!;
    buffer.push(event);
  },
  encryptAndSendToComm: (
    { data, config: { encryption } },
    { payload, client_id }: ISend
  ): void => {
    try {
      const { stream } = data!;

      const message = serializeToJSON(payload);

      const createEnvelope = encrypt(
        message,
        encryption!.encryption_key,
        encryption!.encryption_iv
      );
      stream?.write({
        type: 'MESSAGE',
        client_id,
        payload: createEnvelope as any,
      });
    } catch (error) {
      error_log(error);
    }
  },
  sendToComm: ({ data }, { payload, client_id }: ISend): void => {
    try {
      const { stream } = data!;
      stream?.write({
        type: 'MESSAGE',
        client_id,
        payload: serializeToJSON(payload) as any,
      });
    } catch (error) {
      error_log(error);
    }
  },
  sendHearBeatIntervalToServer: send(
    ({ data }, event) => {
      return event;
    },
    { to: 'on-event-handler-heartbeat' }
  ),
  decryptAndSendPayloadToParent: sendParent(
    ({ config: { encryption } }, { payload }: IMessage): any => {
      try {
        const createEnvelope: string = decrypt(
          payload as any,
          encryption!.encryption_key,
          encryption!.encryption_iv
        );

        const message: PayloadType = deserializeFromJSON(
          createEnvelope
        ) as PayloadType;
        return message;
      } catch (error) {
        error_log(error);
      }
    }
  ),
  decryptAndWrapSendToParent: sendParent(
    ({ config: { encryption } }, { payload, client_id }: IMessage): any => {
      try {
        const createEnvelope = decrypt(
          payload as any,
          encryption!.encryption_key,
          encryption!.encryption_iv
        );
        const message = deserializeFromJSON(createEnvelope) as AnyEventObject;
        return {
          type: 'MESSAGE',
          client_id,
          payload: message,
        };
      } catch (error) {
        error_log(error);
      }
    }
  ),
  sendPayloadToParent: sendParent((_, { payload }: IMessage): any => {
    try {
      const message = deserializeFromJSON(payload as any) as AnyEventObject;
      return message;
    } catch (error) {
      error_log(error);
    }
  }),
  wrapAndSendToParent: sendParent(
    (_, { payload, client_id }: IMessage): any => {
      try {
        const message = deserializeFromJSON(payload as any) as AnyEventObject;
        return {
          type: 'MESSAGE',
          client_id,
          payload: message,
        };
      } catch (error) {
        error_log(error);
      }
    }
  ),

  unassignedAttempts: assign((context) => {
    const new_data = context.data!;
    return {
      data: {
        ...new_data,
        attempts: 0,
      },
    };
  }),
  unassignStreamFromClient: assign((context) => {
    const new_data = context.data!;
    return {
      data: {
        ...new_data,
        stream: undefined,
      },
    };
  }),

  incrementPingCounter: assign({
    //@ts-ignore
    data: ({ data }) => {
      const { ping_counter = 0 } = data!;
      const new_data = {
        ...data,
        ping_counter: ping_counter + 1,
      };
      // console.log("increment 🟢 ping_counter:", ping_counter);
      return new_data;
    },
  }),
  decrementPingCounter: assign({
    //@ts-ignore
    data: ({ data }) => {
      const new_data = {
        ...data,
        ping_counter: 0,
      };
      // console.log("decrement 🔴 ping_counter:", data?.ping_counter);

      return new_data;
    },
  }),
  processExit: () => {
    process.exit(1);
  },
};

export default actions;
