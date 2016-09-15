class InfoService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Info Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default InfoService;
