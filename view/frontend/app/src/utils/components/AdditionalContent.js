// @flow
import React from 'react';
import ko from 'knockout';
import {getRegion} from '$src/additionalContent';

type Props = {
  id: string,
  region: string,
};

const getTemplatePath = (templateName: string) => {
  const [module, ...parts] = templateName.split('/');
  return [module, 'template', ...parts].join('/') + '.html';
};

class AdditionalContent extends React.Component<Props> {
  wrapper = null;
  Component = null;

  componentWillMount() {
    const {region} = this.props;
    const Component = getRegion(region);
    if (!ko.components.isRegistered(region) && Component) {
      const viewModel = new Component();
      this.Component = viewModel;

      ko.components.register(region, {
        viewModel: {instance: viewModel},
        template: {
          require: `text!${getTemplatePath(Component.defaults.template)}`,
        },
      });
    }
  }

  componentDidMount() {
    ko.applyBindings(undefined, this.wrapper);
  }

  render() {
    const {id, region} = this.props;
    return (
      <div
        id={id}
        ref={wrapper => {
          this.wrapper = wrapper;
        }}
        data-bind={`component: ${JSON.stringify(region)}`}
      />
    );
  }
}

const ConditionalWrapper = (props: Props) =>
  getRegion(props.region) ? <AdditionalContent {...props} /> : null;

export default ConditionalWrapper;
