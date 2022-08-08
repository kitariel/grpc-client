import { ActionFunctionMap } from "xstate";
import {
  IContext,
  IConnectionClosedEvent,
  ICloseConnectionEvent,
} from "../types";
import { log, deserializeFromJSON, decrypt } from "../../../util";

const append = log("Grpc Client");

const loggers: ActionFunctionMap<IContext, any> = {
  logStarting: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Started");
    }
  },
  logHeartBeatStarted: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Heart Beat Started");
    }
  },
  logInitialized: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Initialized");
    }
  },
  logRunning: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Running");
    }
  },
  logConnected: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Connected");
    }
  },
  logAssignClientToContext: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Client assigned");
    }
  },
  logAssignStreamToContext: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Stream assigned");
    }
  },
  //************************ */
  //
  //Log Type Message
  //
  //************************ */
  logMessage: ({ config: { verbose, encryption } }, { payload }) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message", info);

    // if (verbose) {
    //   const { envelope } = e.payload;
    //   const info = deserializeFromJSON(envelope);
    //   console.log(append(), "Message", {
    //     ...e,
    //     envelope: info,
    //   });
    // }
  },
  logMessageDecryptAndSendPayloadToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Decrypt And Wrap SendToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Decrypt And Wrap SendToParent", info);

    // if (verbose) {
    //   const { envelope } = e.payload;
    //   const info = deserializeFromJSON(envelope);
    //   console.log(append(), "Message Decrypt And Send PayloadToParent", {
    //     ...e,
    //     envelope: info,
    //   });
    // }
  },
  logMessageDecryptAndWrapSendToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Decrypt And Wrap SendToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Decrypt And Wrap SendToParent", info);

    // if (verbose) {
    //   const { envelope } = e.payload;
    //   const info = deserializeFromJSON(envelope);
    //   console.log(append(), "Message Decrypt And Wrap SendToParent", {
    //     ...e,
    //     envelope: info,
    //   });
    // }
  },
  logMessageSendPayloadToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Send PayloadToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Send PayloadToParent", info);
    // if (verbose) {
    //   const { envelope } = e.payload;
    //   const info = deserializeFromJSON(envelope);
    //   console.log(append(), "Message Send PayloadToParent", {
    //     ...e,
    //     envelope: info,
    //   });
    // }
  },
  logMessageWrapAndSendToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Wrap And SendToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Wrap And SendToParent", info);
    // if (verbose) {
    //   const { envelope } = e.payload;
    //   const info = deserializeFromJSON(envelope);
    //   console.log(append(), "Message Wrap And SendToParent", {
    //     ...e,
    //     envelope: info,
    //   });
    // }
  },
  //************************ */
  //
  //End Log Type Message
  //
  //************************ */
  logSend: ({ config: { verbose } }, { payload }) => {
    if (verbose) {
      console.log(append(), "[Encrypted] Writing to client stream", payload);
    }
  },
  logSendEncrypted: ({ config: { verbose } }, { payload }) => {
    if (verbose) {
      console.log(
        append(),
        "[Encrypted] Sending message to client stream",
        payload
      );
    }
  },
  logSendNotEncrypted: ({ config: { verbose } }, { payload }) => {
    if (verbose) {
      console.log(
        append(),
        "[Not Encrypted] Sending message to client stream",
        payload
      );
    }
  },
  logError: ({ config: { verbose } }, { error }) => {
    if (verbose) {
      console.error(append(), "Error", error.message, "\n", error.stack);
    }
  },
  logIncrementConnectionAttempts: ({ config: { verbose }, data }) => {
    const { attempts } = data!;
    if (verbose) {
      console.log(append(), "Attempts", attempts);
    }
  },
  logClosedConnection: (
    { config: { verbose } },
    { client_id }: IConnectionClosedEvent | ICloseConnectionEvent
  ) => {
    if (verbose) {
      console.log(append(), "Connection Closed", client_id);
    }
  },
};

export default loggers;
