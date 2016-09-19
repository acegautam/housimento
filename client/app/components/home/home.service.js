class HomeService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Home Service';
        this.$http = $http;
    }

    getInfo() {
        // return this.$http.get('sample.json');        
    }

    getSentimentData() {
        // return this.$http.get('sentimentData.json');

        let baseUrl = 'http://access.alchemyapi.com/calls/url/URLGetCombinedData';
        let apikey = 'bd3546fc63db703c583027abffdcf397fd85bd52';
        let options = 'extract=entities&sentiment=1&emotion=1';
        let sourceUrl = 'http://www.cnbc.com/2016/05/16/buffetts-berkshire-hathaway-takes-new-stake-in-apple.html';

        let url = `${baseUrl}?url=${sourceUrl}&apikey=${apikey}&${options}&outputMode=json`;

        return this.$http.get(url);
    }
}
export default HomeService;
