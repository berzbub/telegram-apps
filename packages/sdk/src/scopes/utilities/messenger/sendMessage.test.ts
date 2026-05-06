import { beforeEach, describe, vi, it, expect } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { sendMessage, isSendingMessage, sendMessageError } from '@/scopes/utilities/messenger/sendMessage.js';
import {
  mockMiniAppsEnv,
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
} from '@test-utils/utils.js';
import { emitEvent } from '@telegram-apps/bridge';
import { SendMessageError } from '@/errors.js';

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(sendMessage, 'sendMessage', { minVersion: '8.0' });
});

describe('safe', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should call "web_app_send_prepared_message" with id specified', () => {
    const spy = mockPostEvent();
    void sendMessage('ABC');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_send_prepared_message', { id: 'ABC' });
  });

  it('should resolve promise when "prepared_message_sent" event was received', async () => {
    const promise = sendMessage('ABC');
    emitEvent('prepared_message_sent');
    await expect(promise).resolves.toBeUndefined();
  });

  it('should reject promise when "prepared_message_failed" event was received', async () => {
    const promise = sendMessage('ABC');
    emitEvent('prepared_message_failed', { error: 'My custom error' });
    await expect(promise).rejects.toStrictEqual(
      new SendMessageError('My custom error'),
    );
  });

  it('should set isSendingMessage to true while request is in progress', () => {
    expect(isSendingMessage()).toBe(false);
    void sendMessage('ABC');
    expect(isSendingMessage()).toBe(true);
    emitEvent('prepared_message_sent');
  });

  it('should set isSendingMessage to false after request completes', async () => {
    const promise = sendMessage('ABC');
    emitEvent('prepared_message_sent');
    await promise;
    expect(isSendingMessage()).toBe(false);
  });

  it('should set sendMessageError on failure', async () => {
    const promise = sendMessage('ABC');
    emitEvent('prepared_message_failed', { error: 'oops' });
    await expect(promise).rejects.toThrow();
    expect(sendMessageError()).toStrictEqual(new SendMessageError('oops'));
  });

  it('should reject with ConcurrentCallError if already sending a message', async () => {
    void sendMessage('ABC');
    await expect(sendMessage('DEF')).rejects.toThrow('Send message request is currently in progress');
  });
});
