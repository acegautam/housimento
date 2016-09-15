import template from './about.html';
import controller from './about.controller';

let aboutComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default aboutComponent;
