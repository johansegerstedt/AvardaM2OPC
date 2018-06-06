// @flow
import React, {type ComponentType, Component} from 'react';
type Subscription = {dispose(): void};
type Observable = () => any & {subscribe: ((any) => any) => Subscription};

const subscribe = (subscriptions: {[string]: Observable}) => (
  WrappedComponent: ComponentType<any>,
) => {
  class Subscription extends Component<*, *> {
    static displayName = `subscribe(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    subscriptions = [];
    ref = null;

    state = Object.keys(subscriptions).reduce((state, key) => {
      state[key] = subscriptions[key]();
      return state;
    }, {});

    componentDidMount() {
      this.subscriptions = Object.keys(subscriptions).map(key => {
        const observable = subscriptions[key];
        return observable.subscribe(value => {
          if (this.ref) {
            this.setState({[key]: value});
          }
        });
      });
    }

    componentWillUnMount() {
      this.subscriptions.forEach(subscription => subscription.dispose());
    }

    render() {
      return (
        <WrappedComponent
          ref={ref => {
            this.ref = ref;
          }}
          {...this.props}
          {...this.state}
        />
      );
    }
  }
  return Subscription;
};

export default subscribe;
