class AboutService {
    /* @ngInject */

    constructor($http) {
        this.name = 'About Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default AboutService;
