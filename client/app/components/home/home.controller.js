import {round} from 'lodash';

class HomeController {
  /* @ngInject */

  constructor(HomeService, $mdDialog, $q) {
    this.name = 'Home Screen';
    this.$mdDialog = $mdDialog
    this.$q = $q;
    this.homeService = HomeService;
    this.init();
  }

  init() {
    this.getSentimentData();
  }

  getSentimentData() {

    let promises = this.homeService.getSentimentFromSources();

    // Retrieve alchemy language data extracted from different sources
    this.$q.all(promises).then((response) => {
      // console.log('response', response);
      let cnbcData = response[0].data;
      cnbcData.source = 'CNBC';

      let twitterData = response[1].data;
      twitterData.source = 'Twitter';

      let cnnData = response[2].data;
      cnnData.source = 'CNN';

      let info = [cnbcData, twitterData, cnnData];
      console.log('info', info);

      this.renderScore(info);
      this.renderChart(info);
    });
  }

  renderScore(info) {
    const colors = ['#fbdf5f', '#4aad62', '#e74565'];
    this.score = this._getSentimentScore(info);
    this.score = 0.49;

    if(this.score < 0){
        this.activeClass = 'bg-red';      
    }
    else if(this.score === 0){
        this.activeClass = 'bg-amber';      
    }
    else{
        this.activeClass = 'bg-green';      
    }
  }

  renderChart(info) {
    // Parse data & transform to a model compatible with NVD3 charts
    let graphInfo = this._parseSentimentData(info);
    console.log('graphInfo', graphInfo);

    // Plot the visual chart
    this._generateChart(graphInfo);
  }

  _getSentimentScore(info) {
    // Get overall sentiment score for the entire dataset
    let score = 0;
    info.forEach((item) => {
      if (item.docSentiment) {
        score += parseFloat(item.docSentiment.score);
      }
    });
    console.log('score', round(score, 2));
    return round(score, 2);
  }

  _parseSentimentData(info) {
    let colors = ['#fbdf5f', '#4aad62', '#e74565'];
    let keys = ['joy', 'fear', 'anger'];
    let array1 = [], array2 = [], array3 = [];
    let mainArray = [array1, array2, array3];
    let data = keys.map((key, i) => {
      info.forEach((item, j) => {
        if (!item.docEmotions) {
          return;
        }
        mainArray[i].push({
          'series': i,
          'x': j,
          'y': item.docEmotions[keys[i]]
        });
      });
      return {
        area: true,
        color: colors[i],
        key: keys[i],
        values: mainArray[i]
      }
    })
    return data;
  }

  _generateChart(graphInfo) {
    this.options = {
      chart: {
        type: 'lineChart',
        height: 400,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log("stateChange"); },
          changeState: function (e) { console.log("changeState"); },
          tooltipShow: function (e) { console.log("tooltipShow"); },
          tooltipHide: function (e) { console.log("tooltipHide"); }
        },
        xAxis: {
          axisLabel: 'Source #'
        },
        yAxis: {
          axisLabel: 'Sentiment Level (SL)',
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log("!!! lineChart callback !!!");
        }
      }
    };
    this.data = graphInfo;
  }
}

export default HomeController;
