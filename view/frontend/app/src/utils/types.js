// @flow

export type MessageType = 'error' | 'notice' | 'success' | 'warning';

export type Message = {type: MessageType, message: string};

export type MessageState = {
  ...MessageState,
  id: string,
};
