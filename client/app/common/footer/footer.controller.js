class FooterController {
  /* @ngInject */

  constructor(FooterService) {
    this.name = 'Footer Controller';
    this.footerService = FooterService;
    // this.init();
  }

  init(){
    this.footerService.getInfo()
      .then((response) => {
        this.info = response.data;
      });
  }
}

export default FooterController;
