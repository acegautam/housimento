import _ from 'lodash';

class AboutController {
  /* @ngInject */

  constructor(AboutService, $mdDialog) {
    this.name = 'About Me';
    this.directiveTitle = 'INFO - I am an embedded component inside About Me';
    this.info = null;
    this.$mdDialog = $mdDialog;
    this.comment = 'My first comment';
    this.aboutService = AboutService;
    this.init();
  }

  init() {
    this.aboutService.getInfo()
      .then((response) => {
        this.info = response.data;
        console.log(this.info);
      });
  }

  showMesssage(message){
    this.showInfoDialog(message);
  }

  showInfoDialog(message, e){
    message = message || 'Hola';
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .clickOutsideToClose(true)
        // .title('Super useful message')
        .textContent(`${message}`)
        // .ariaLabel('Alert Dialog Demo')
        .ok('Okay')
        .targetEvent(e)
    );
  }
}

export default AboutController;
