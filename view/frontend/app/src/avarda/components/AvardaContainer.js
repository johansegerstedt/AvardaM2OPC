// @flow
import React, {Component} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect /*, type Connector */} from 'react-redux';
import {getConfig} from '$src/config';
import AvardaCheckOut, {type Props} from './AvardaCheckOut';
import {getPurchaseId, getIsFetching} from '../selectors';
import {addressChanged, completePaymentPressed} from '../actions';
import type {AppState} from '$src/root/types';
import Loader from '$src/utils/components/Loader/Loader';

/**
 * This container represents actual IFRAME handling and Avarda processing
 */

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
    window.location.href =
      getConfig().saveOrderUrl + `purchase/` + encodeURIComponent(purchaseId);
  };

  render() {
    const {purchaseId, isFetching, ...props} = this.props;
    const {avardaConfig: {customCssUrl, replaceDefaultCss}} = getConfig();
    return purchaseId ? (
      <AvardaCheckOut
        purchaseId={purchaseId}
        onDone={this.onDone}
        callbackUrl={`${getConfig().callbackUrl}purchase/${encodeURIComponent(
          purchaseId,
        )}`}
        customCssUrl={customCssUrl ? customCssUrl : undefined}
        replaceDefaultCss={replaceDefaultCss}
        {...props}
      />
    ) : (
      <Loader show={isFetching} height={0}>
        {null}
      </Loader>
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
// Hack to let flow know we don't want any props
// eslint-disable-next-line no-unused-vars
const withoutProps = (props: {||}) => <Connected />;
export default withoutProps;
