// @flow
import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  name?: string,
};

const Hello = ({name = 'World'}: Props = {}) => (
  <h1>{`Hello from React, ${name}!`}</h1>
);

const container = document.getElementById('checkout-root');
if (container !== null) {
  ReactDOM.render(<Hello />, container);
}
