// @flow
import React, {Component} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect /*, type Connector */} from 'react-redux';
import AvardaCheckOut, {type Props} from './AvardaCheckOut';
import {getPurchaseId} from '../selectors';
import {addressChanged} from '../actions';
import type {AppState} from '$src/root/types';

type StateProps = {|
  purchaseId: null | $PropertyType<Props, 'purchaseId'>,
|};

type DispatchProps = {|
  onDone: $PropertyType<Props, 'onDone'>,
  onBeforeSubmit?: $PropertyType<Props, 'onBeforeSubmit'>,
  onBeforeCompleteHook?: $PropertyType<Props, 'onBeforeCompleteHook'>,
  onUpdateDeliveryAddressHook?: $PropertyType<
    Props,
    'onUpdateDeliveryAddressHook',
  >,
|};

type ConnectedProps = {|
  ...StateProps,
  ...DispatchProps,
|};

class AvardaCheckOutContainer extends Component<ConnectedProps> {
  render() {
    /* eslint-disable no-unused-vars */
    const {purchaseId, ...props} = this.props;
    /* eslint-enable no-unused-vars */
    return purchaseId ? (
      <AvardaCheckOut
        purchaseId={purchaseId}
        {...props}
        onBeforeSubmit={pid => {
          const ans = window.prompt(pid);
          return ans === 'true';
        }}
        onBeforeCompleteHook={(result, pid) => {
          const ans = window.prompt('Should complete?' + pid);
          return ans === 'true' ? result.continue() : result.cancel();
        }}
      />
    ) : null;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  purchaseId: getPurchaseId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      onDone: () => (
        alert('Purchase might be done - should check payment status'),
        {type: 'onDone', payload: 'hello'}
      ),
      onUpdateDeliveryAddressHook: addressChanged,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
const Connected = connector(AvardaCheckOutContainer);
// eslint-disable-next-line no-unused-vars
const withoutProps = (props: {||}) => <Connected />;
export default withoutProps;
