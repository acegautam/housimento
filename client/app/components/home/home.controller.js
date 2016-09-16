class HomeController {
  /* @ngInject */

  constructor(HomeService, $mdDialog) {
    this.name = 'Home Screen';
    this.$mdDialog = $mdDialog
    this.homeService = HomeService;
    this.init();
  }

  doSomething(){
    this.$mdDialog.show(
        this.$mdDialog.alert()
          .textContent('Something done!')
          .ok('Cool!')
      );
  }

  init(){
    this.homeService.getInfo()
      .then((response) => {
        this.info = response.data;
      });
  }
}

export default HomeController;
