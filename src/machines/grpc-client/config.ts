import { MachineConfig, AnyStateNodeDefinition } from "xstate";
import { IContext, IMachineEvents } from "./types";

const config: MachineConfig<
  IContext,
  AnyStateNodeDefinition,
  IMachineEvents
> = {
  initial: "create_client",
  states: {
    create_client: {
      invoke: [
        {
          src: "createGRPCCLient",
        },
      ],
      on: {
        // TODO: Discuss whether client is still needed, when we only need the stream.
        CLIENT_CREATED: {
          actions: ["logAssignClientToContext", "assignClientToContext"],
          target: "idle",
        },
      },
    },
    idle: {
      after: {
        1000: [
          {
            cond: "isAttemptMax",
            actions: [
              "logIncrementConnectionAttempts",
              "incrementConnectionAttempts",
            ],
            target: "start",
          },
          {
            actions: "processExit",
          },
        ],
      },
      on: {
        SEND: {
          actions: "enqueueMessage",
        },
      },
    },
    start: {
      entry: ["logStarting"],
      invoke: {
        src: "initializedGRPCStream",
      },
      on: {
        SEND: {
          actions: "enqueueMessage",
        },
        ERROR: [
          {
            actions: ["logError"],
            target: "create_client",
          },
        ],
        STREAM_CREATED: {
          actions: ["logAssignStreamToContext", "assignStreamToContext"],
          target: "running",
        },
      },
    },
    running: {
      entry: ["unassignedAttempts"],
      invoke: [
        {
          src: "loadServices",
        },
        {
          src: "unloadEnqueuedMessages",
        },
        {
          id: "on-event-handler-heartbeat",
          src: "onEventHandlerHeartBeat",
        },
      ],
      on: {
        SEND: [
          {
            cond: "isEncrypted",
            actions: ["logSendEncrypted", "encryptAndSendToComm"],
          },
          {
            actions: ["logSendNotEncrypted", "sendToComm"],
          },
        ],
        MESSAGE: [
          {
            cond: "isEncryptedAndTransparent",
            actions: [
              "logMessageDecryptAndSendPayloadToParent",
              "decryptAndSendPayloadToParent",
            ],
          },
          {
            cond: "isEncryptedButNotTransparent",
            actions: [
              "logMessageDecryptAndWrapSendToParent",
              "decryptAndWrapSendToParent",
            ],
          },
          {
            cond: "isTransparent",
            actions: ["logMessageSendPayloadToParent", "sendPayloadToParent"],
          },
          {
            actions: ["logMessageWrapAndSendToParent", "wrapAndSendToParent"],
          },
        ],
        START_HEARTBEAT: {
          actions: ["logHeartBeatStarted", "sendHearBeatIntervalToServer"],
        },
        INCREMENT_PING: [
          {
            cond: "hasReachedMaxPings",
            actions: ["processExit"],
          },
          {
            actions: ["incrementPingCounter"],
          },
        ],
        HEARTBEAT: {
          actions: ["decrementPingCounter"],
          // actions: ["logHeartBeatStarted", "sendHearBeatIntervalToServer"],
        },
        // Disconnected from server unexpectedly.
        CONNECTION_CLOSED: {
          actions: ["logClosedConnection", "unassignStreamFromClient"],
          target: "create_client",
        },
        // Parent wants to disconnect.
        CLOSE_CONNECTION: [
          {
            cond: "connectionExists",
            actions: ["logClosedConnection", "unassignStreamFromClient"],
          },
        ],
        ERROR: {
          actions: ["logError"],
          target: "create_client",
        },
      },
    },
    done: {
      type: "final",
    },
  },
};

export default config;
