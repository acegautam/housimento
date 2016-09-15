class <%= upCaseName %>Service {
    /* @ngInject */

    constructor($http) {
        this.name = '<%= upCaseName %> Service';
        this.$http = $http;
    }

    getInfo(){
        return this.$http.get('sample.json');
    }
}
export default <%= upCaseName %>Service;
