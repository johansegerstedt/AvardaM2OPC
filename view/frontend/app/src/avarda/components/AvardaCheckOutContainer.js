// @flow
import React, {Component} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect /*, type Connector */} from 'react-redux';
import {getConfig} from '$src/config';
import Loader from '$src/utils/components/Loader';
import AvardaCheckOut, {type Props} from './AvardaCheckOut';
import {getPurchaseId, getIsFetching} from '../selectors';
import {addressChanged, completePaymentPressed} from '../actions';
import type {AppState} from '$src/root/types';

type StateProps = {|
  purchaseId: null | $PropertyType<Props, 'purchaseId'>,
  isFetching: boolean,
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
    const {purchaseId, isFetching, ...props} = this.props;
    return purchaseId ? (
      <AvardaCheckOut purchaseId={purchaseId} onDone={this.onDone} {...props} />
    ) : (
      <Loader isLoading={isFetching}>{null}</Loader>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  purchaseId: getPurchaseId(state),
  isFetching: getIsFetching(state),
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
