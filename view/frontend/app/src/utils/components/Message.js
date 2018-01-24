// @flow
import React, {Component, type Node} from 'react';
import type {MessageType} from '../types';

type Props = {
  msg: string,
  type: $Values<typeof MessageTypes>,
};

export const getMessageClass = (type: string): string =>
  `message ${type} message-${type}`;

export const MessageTypes: {[string]: MessageType} = {
  ERROR: 'error',
  NOTICE: 'notice',
  SUCCESS: 'success',
  WARNING: 'warning',
};

export class Message extends Component<Props> {
  static Types = MessageTypes;

  render() {
    const {msg, type} = this.props;
    return (
      <div className={getMessageClass(type)} role="alert" aria-label={type}>
        <div>{msg}</div>
      </div>
    );
  }
}

export const Messages = ({children}: {children: Node}) =>
  children && (
    <div className="messages" role="alert">
      {children}
    </div>
  );
