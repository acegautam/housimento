class <%= upCaseName %>Controller {
  /* @ngInject */

  constructor(<%= upCaseName %>Service) {
    this.name = '<%= upCaseName %> Controller';
    this.<%= name %>Service = <%= upCaseName %>Service;
    // this.init();
  }

  init(){
    this.<%= name %>Service.getInfo()
      .then((response) => {
        this.info = response.data;
      });
  }
}

export default <%= upCaseName %>Controller;
