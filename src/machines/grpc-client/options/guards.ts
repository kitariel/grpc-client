import { ConditionPredicate } from "xstate";
import { IContext, IMachineEvents } from "../types";
import { IRecord } from "../types";
const error_log = (error: Error) => {
  console.log(`[${new Date().toISOString()}]`, error);
};
const { RECONN_ATTEMPT = "10" } = process.env;

const guards: IRecord<ConditionPredicate<IContext, IMachineEvents>> = {
  isAttemptMax: ({ data }) => {
    try {
      const { attempts } = data!;
      return attempts === parseInt(RECONN_ATTEMPT) ? false : true;
    } catch (error) {
      error_log(error);
      return false;
    }
  },
  isEncrypted: ({ config: { encryption } }) => (encryption ? true : false),
  isEncryptedAndTransparent: ({ config: { encryption, transparent } }) =>
    encryption && transparent ? true : false,
  isEncryptedButNotTransparent: ({ config: { encryption, transparent } }) =>
    encryption && !transparent ? true : false,
  isTransparent: ({ config: { transparent } }) => (transparent ? true : false),
  connectionExists: ({ data }) => {
    const { stream } = data!;
    return stream ? true : false;
  },
  hasReachedMaxPings: ({ data }) => {
    const { ping_counter } = data!;
    return ping_counter >= 5;
  },
};

export default guards;
