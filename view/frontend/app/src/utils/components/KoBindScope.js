// @flow
import React, {Component} from 'react';
import ko from 'knockout';

const getTemplateHTML = `
  <!-- ko if: hasTemplate() -->
    <!-- ko template: getTemplate() --><!-- /ko -->
  <!-- /ko -->
`;

type Props = {
  scope: string,
  divProps?: Object,
};

class KoBindScope extends Component<Props> {
  node = null;

  componentDidMount() {
    // Bind if the wrapper doesn't already have binding
    if (!ko.dataFor(this.node)) {
      ko.applyBindings(undefined, this.node);
    }
  }

  render() {
    return (
      <div
        ref={div => {
          this.node = div;
        }}
        data-bind={`scope: ${JSON.stringify(this.props.scope)}`}
        dangerouslySetInnerHTML={{__html: getTemplateHTML}}
        {...this.props.divProps}
      />
    );
  }
}

export default KoBindScope;
