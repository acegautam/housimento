class FooterService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Footer Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default FooterService;
