class HeaderController {
  /* @ngInject */

  constructor(HeaderService, $rootScope, $mdSidenav) {
    this.name = 'Header Controller';
    this.headerService = HeaderService;
    this.$mdSidenav = $mdSidenav;
    // this.init();
  }

  init(){
    this.headerService.getInfo()
      .then((response) => {
        this.info = response.data;
      });
  }

  toggleSidenav(menuId) {
    this.$mdSidenav(menuId).toggle();
  }
}

export default HeaderController;
