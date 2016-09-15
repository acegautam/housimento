class HomeController {
  /* @ngInject */

  constructor(HomeService, $mdDialog) {
    this.name = 'Home Screen';
    this.$mdDialog = $mdDialog
    this.homeService = HomeService;
    // this.init();
  }

  init() {
    // Initialization tasks
  }

  getInfo(e) {
    this.homeService.getInfo()
      .then((response) => {
        this.info = response.data;
        console.log(this.info);
        this.showInfoDialog(this.info, e);
      });
  }
  showInfoDialog(info, e){
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Super useful info')
        .textContent(`This is a house with ${info[0].name}`)
        .ariaLabel('Alert Dialog Demo')
        .ok('Gracias!')
        .targetEvent(e)
    );
  }
}

export default HomeController;
