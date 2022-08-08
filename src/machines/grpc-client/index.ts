import { Machine, interpret } from "xstate";

import { IContext } from "./types";
import config from "./config";
import options from "./options";

export const spawn = (context: IContext) =>
  Machine({ ...config, context }, options);

export const Interpret = (context: IContext) => {
  const machine = spawn(context);
  const service = interpret(machine);
  return service;
};
