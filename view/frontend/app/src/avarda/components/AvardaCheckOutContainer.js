// @flow
import React, {Component} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect /*, type Connector */} from 'react-redux';
import AvardaCheckOut, {type Props} from './AvardaCheckOut';
import {getPurchaseId} from '../selectors';
import {fetchPurchaseId} from '../actions';
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
  fetchPurchaseId(): any,
|};

type ConnectedProps = {|
  ...StateProps,
  ...DispatchProps,
|};

class AvardaCheckOutContainer extends Component<ConnectedProps> {
  componentDidMount() {
    this.props.fetchPurchaseId();
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      purchaseId,
      fetchPurchaseId: __ignore_fetchPurchaseId__,
      ...props
    } = this.props;
    /* eslint-enable no-unused-vars */
    return purchaseId ? (
      <AvardaCheckOut purchaseId={purchaseId} {...props} />
    ) : null;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  purchaseId: getPurchaseId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      fetchPurchaseId,
      onDone: () => (
        alert('Purchase might be done - should check payment status'),
        {type: 'onDone', payload: 'hello'}
      ),
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
const Connected = connector(AvardaCheckOutContainer);
// eslint-disable-next-line no-unused-vars
const withoutProps = (props: {||}) => <Connected />;
export default withoutProps;
