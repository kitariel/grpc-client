import path from 'path';
import crypto from 'crypto';
import { loadSync } from '@grpc/proto-loader';
import { credentials, loadPackageDefinition } from '@grpc/grpc-js';

export const log = (module_name: string) => () =>
  `[${new Date().toISOString()}][${module_name}]:`;

export const serializeToJSON = (literal: any) => JSON.stringify(literal);

export const deserializeFromJSON = (json_string: string) =>
  JSON.parse(json_string);

export const encrypt = (
  val: string,
  encryption_key: string,
  encryption_iv: string
) => {
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    encryption_key,
    encryption_iv
  );
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const decrypt = (
  encrypted: string,
  encryption_key: string,
  encryption_iv: string
) => {
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    encryption_key,
    encryption_iv
  );
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};

///
export const createClient = (endpoints = 'localhost:50051') => {
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  const proto_path = path.resolve(__dirname, 'machines/protos/Events.proto');
  const packageDefinition = loadSync(proto_path, options);
  // load package definition
  const Proto = loadPackageDefinition(packageDefinition);
  // added client services

  //@ts-ignore
  const client = new Proto['Events'](endpoints, credentials.createInsecure(), {
    max_receive_message_length: 1 * 1024 * 1024 * 1024, // 1GB Length Message
  });

  return client;
};
