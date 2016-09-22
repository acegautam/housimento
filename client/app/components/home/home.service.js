class HomeService {
    /* @ngInject */

    constructor($http) {
        this.name = 'Home Service';
        this.$http = $http;
    }

    getEmoSourceData(){
        return sourceText;       
    }
    getEmoData(){
        return this.$http.get('sample.json');        
    }

    getCountryData(){
        return this.$http.get('countries.json');        
    }

    getPromise(sourceUrl) {
        // return this.$http.get('sentimentData.json');

        const endpoint = 'URLGetCombinedData';
        const baseUrl = `http://access.alchemyapi.com/calls/url/${endpoint}`;
        const apikey = 'bd3546fc63db703c583027abffdcf397fd85bd52';
        const options = 'extract=doc-emotion,doc-sentiment&sentiment=1&emotion=1';
        sourceUrl = sourceUrl || 'http://www.cnbc.com/2016/05/16/buffetts-berkshire-hathaway-takes-new-stake-in-apple.html';

        const url = `${baseUrl}?url=${sourceUrl}&apikey=${apikey}&${options}&outputMode=json`;
        return this.$http.get(url);
    }

    getSentimentFromSources(){
        let cnbcPromise = this.getPromise('http://www.cnbc.com/2016/05/16/buffetts-berkshire-hathaway-takes-new-stake-in-apple.html');
        let twitterPromise = this.getPromise('https://twitter.com/LATrealestate/status/777043187718160385');
        let cnnPromise = this.getPromise('http://money.cnn.com/2016/08/31/real_estate/real-estate-inequality/');
        // let twitterPromise = this.getPromise();
        
        return [cnbcPromise, twitterPromise, cnnPromise];
    }
}
export default HomeService;
