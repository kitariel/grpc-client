import { spawn as SpawnTester } from "./index";
import { Machine, assign, spawn, interpret, send } from "xstate";

const { GRPC_PORT = "50051" } = process.env;
const implementation = {
  services: {
    userInput: ({ client_test_id }: any) => (send: any) => {
      process.stdin.on("data", (data) => {
        send({ type: "SEND", payload: data.toString().replace("\n", "") });
      });
    },
  },
  actions: {
    spawnTemplate: assign({
      clients: () => {
        const instance = SpawnTester({
          config: {
            host: "10.110.3.40",
            port: 50051,
            transparent: true,
            verbose: true,
            // encryption: {
            //   encryption_key: "bf3c199c2470cb477d907b1e0917c17b",
            //   encryption_iv: "5183666c72eec9e4",
            // },
            // max_pings: 5,
          },
          data: {
            attempts: 0,
            buffer: [],
            ping_counter: 0,
          },
        });
        return spawn(instance);
      },
    }),
    assignClientId: assign({
      client_envelope: (_, { envelope }: any) => {
        return envelope;
      },
    }),
    assignClientIdByEVENT: assign({
      client_envelope: (_, { payload }: any) => {
        return payload.envelope;
      },
    }),
    sendTest: send(
      ({ client_envelope }: any, e: any) => {
        return {
          type: "SEND",
          envelope: client_envelope,
          payload: {
            type: "TYPES",
            payload: {
              message: "hey",
            },
          },
        };
      },
      { to: ({ clients }) => clients }
    ),
  },
};

const config = Machine(
  {
    initial: "start",
    context: {
      clients: {} as any,
      //@ts-ignore
      client_envelope: {} as any,
    },
    entry: ["spawnTemplate"],
    states: {
      start: {
        on: {
          CONNECTION: {
            //@ts-ignore
            actions: [
              "assignClientId",
              (_: any, e: any) => console.log("@@@@@CLIENT", e),
            ],
            target: "userEntry",
          },
          // MESSAGE: {
          //   //@ts-ignore
          //   actions: [
          //     "assignClientIdByEVENT",
          //     (_: any, e: any) =>
          //       console.log("@@@@@CLIENT : MESSAGE EVENT", e.payload),
          //   ],
          //   target: "userEntry",
          // },
          // "*": {
          //   actions: ["sendTest"],
          // },
        },
      },
      userEntry: {
        invoke: {
          src: "userInput",
        },
        on: {
          SEND: {
            actions: [() => console.log("SENDING....."), "sendTest"],
          },
          "*": {
            actions: [(_, e) => console.log("@@@@@MESSAGE FROM SERVER", e)],
          },
        },
      },
    },
  },
  implementation
);

const service = interpret(config).start();
