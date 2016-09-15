class HeaderService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Header Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default HeaderService;
