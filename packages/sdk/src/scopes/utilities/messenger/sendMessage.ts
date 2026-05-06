import type { AbortablePromise } from 'better-promises';

import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { SendMessageError } from '@/errors.js';
import type { AsyncOptions } from '@/types.js';

const METHOD_NAME = 'web_app_send_prepared_message';

const [
  fn,
  tPromise,
  tError,
] = defineNonConcurrentFn(
  (id: string, options?: AsyncOptions): AbortablePromise<void> => {
    return request(METHOD_NAME, ['prepared_message_failed', 'prepared_message_sent'], {
      ...options,
      params: { id },
    }).then(data => {
      if (data && 'error' in data) {
        throw new SendMessageError(data.error);
      }
    });
  },
  'Send message request is currently in progress',
);

/**
 * Opens a dialog allowing the user to share a message provided by the bot.
 * @param id - identifier of the PreparedInlineMessage previously obtained via the Bot API.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {ConcurrentCallError} Send message request is currently in progress
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {SendMessageError} Message sending failed
 * @example
 * if (sendMessage.isAvailable()) {
 *   await sendMessage('bbhjSYgvck23');
 * }
 */
export const sendMessage = wrapSafe('sendMessage', fn, { isSupported: METHOD_NAME });
export const [, sendMessagePromise, isSendingMessage] = tPromise;
export const [, sendMessageError] = tError;
