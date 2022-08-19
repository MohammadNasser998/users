import morgan from 'morgan';
import os from 'os';

morgan.token('conversation-id', req => req.conversationId);
morgan.token('session-id', req => req.sessionId);
morgan.token('instance-id', req => req.instanceId);
morgan.token('hostname', () => os.hostname());
morgan.token('pid', () => process.pid);
morgan.token('id', req => req.id);
morgan.token('body', req => req.body);
morgan.token('headers', req => req.headers);
morgan.token('appVersion', () => '0.0.1');

const SECURED_BODY_TOKENS = [
  { key: 'number', regex: /.(?=.{4,}$)/g },
  { key: 'cvc', regex: /[0-9]/g },
  { key: 'password', regex: /.*/ },
];

function reqJsonFormat(tokens, req, res) {
  return JSON.stringify({
    requestId: tokens.id(req, res),
    'remote-address': tokens['remote-addr'](req, res),
    time: tokens.date(req, res, 'iso'),
    httpMethod: tokens.method(req, res),
    url: tokens.url(req, res),
    body: {
      ...tokens.body(req, res),
      ...SECURED_BODY_TOKENS.map(prop => (tokens.body(req)[prop.key] ? { [prop.key]: tokens.body(req)[prop.key].replace(prop.regex, '*') } : undefined))
        .filter(a => a)
        .reduce((acc, current) => Object.assign(acc, current), {}),
    },
    'http-version': tokens['http-version'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'conversation-id': tokens['conversation-id'](req, res),
    'session-id': tokens['session-id'](req, res),
    hostname: tokens.hostname(req, res),
    'req-headers': JSON.stringify(tokens.headers(req, res)),
    instance: tokens['instance-id'](req, res),
    pid: tokens.pid(req, res),
    appVersion: tokens.appVersion(),
  });
}
function resJsonFormat(tokens, req, res) {
  return JSON.stringify({
    requestId: tokens.id(req, res),
    time: tokens.date(req, res, 'iso'),
    httpMethod: tokens.method(req, res),
    'status-code': tokens.status(req, res),
    'res-time': `${tokens['response-time'](req, res)} ms`,
    'res-headers': JSON.stringify(tokens.headers(req, res)),
    pid: tokens.pid(req, res),
    appVersion: tokens.appVersion(),
  });
}

export default isImmediate => {
  const jsonFormat = isImmediate ? reqJsonFormat : resJsonFormat;
  const methodName = `morganLogger::${isImmediate ? 'Request' : 'Response'}`;
  return morgan(jsonFormat, {
    stream: {
      write: message => {
        const jsonMessage = JSON.parse(message);
        Logger.info(methodName, methodName, jsonMessage.requestId, jsonMessage);
      },
    },
    immediate: isImmediate,
  });
};
