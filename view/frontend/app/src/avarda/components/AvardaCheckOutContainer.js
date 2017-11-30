// @flow
import React, {Component} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect /*, type Connector */} from 'react-redux';
import {getConfig} from '$src/config';
import AvardaCheckOut, {type Props} from './AvardaCheckOut';
import {getPurchaseId} from '../selectors';
import {addressChanged, completePaymentPressed} from '../actions';
import type {AppState} from '$src/root/types';

type StateProps = {|
  purchaseId: null | $PropertyType<Props, 'purchaseId'>,
|};

type DispatchProps = {|
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
  // All the checks are handled in backend.
  // eslint-disable-next-line no-unused-vars
  onDone = (purchaseId: string) => {
    window.location.href = getConfig().saveOrderUrl;
  };

  render() {
    const {purchaseId, ...props} = this.props;
    return purchaseId ? (
      <AvardaCheckOut purchaseId={purchaseId} onDone={this.onDone} {...props} />
    ) : null;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  purchaseId: getPurchaseId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      onUpdateDeliveryAddressHook: addressChanged,
      onBeforeCompleteHook: completePaymentPressed,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
const Connected = connector(AvardaCheckOutContainer);
// eslint-disable-next-line no-unused-vars
const withoutProps = (props: {||}) => <Connected />;
export default withoutProps;
