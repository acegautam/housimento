class InfoController {
  /* @ngInject */

  constructor(InfoService) {
    this.name = 'Info Controller';
    this.infoService = InfoService;
  }

  test(){
    console.log('test');
  }
}

export default InfoController;
