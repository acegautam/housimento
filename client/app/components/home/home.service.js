class HomeService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Home Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default HomeService;
