// @flow
import React, {type Node} from 'react';
import {toast} from 'react-toastify';
import {Message, getMessageClass} from '$src/utils/components/Message';
import type {MessageType} from '$src/utils/types';

const MessageToastTypes = {
  [Message.Types.ERROR]: toast.TYPE.ERROR,
  [Message.Types.NOTICE]: toast.TYPE.INFO,
  [Message.Types.SUCCESS]: toast.TYPE.SUCCESS,
  [Message.Types.WARNING]: toast.TYPE.WARNING,
};

export const toastMessage = (
  msg: Node,
  type: MessageType = Message.Types.NOTICE,
  options?: Object = {},
) =>
  toast[MessageToastTypes[type]](<div role="alert">{msg}</div>, {
    ...options,
    className: `${getMessageClass(type)} ${
      options.className ? options.className : ''
    }}`,
  });

export const TYPES = Message.Types;

export default toastMessage;
