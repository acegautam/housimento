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
    // this.getCountryData();
    // this.getEmoData();
  }

  getEmoData() {
    this.homeService.getEmoData().then((response) => {
      this.emoSourceData = this.homeService.getEmoSourceData();
      let emoData = response.data;
      // console.log('emoSourceData', this.emoSourceData);
      console.log('emoData', emoData);
      // this._generateChart(emoData);
    });
  }

  getCountryData() {
    this.homeService.getCountryData().then((response) => {
      let countryData = response.data;
      this._generateChart(countryData);
    });
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
    // this.score = 0.49;

    if (this.score < 0) {
      this.activeClass = 'bg-red';
    }
    else if (this.score === 0) {
      this.activeClass = 'bg-amber';
    }
    else {
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
    const avgScore = score / info.length;
    console.log('avgScore', round(avgScore, 2));
    return round(avgScore, 2);
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
    this.options = this._getOptions();
    // this.options = this._getStackOptions();
    this.data = graphInfo;
  }

  _getOptions() {
    return {
      chart: {
        type: 'lineChart',
        height: 400,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        lines: {
          dispatch: {
            elementClick: function (e) { console.log('click', e) },
            elementMouseover: function (e) { console.log('mouseover') },
            elementMouseout: function (e) { console.log('mouseout') },
            renderEnd: function (e) { console.log('renderEnd') }
          }
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
          // console.log('chart', chart);
          console.log("!!! lineChart callback !!!");
          // chart.lineChart.dispatch.on('elementClick', function(e){
          //     console.log('elementClick in callback', e.data);                             
          // });
        }
      }
    };
  }

  _getStackOptions() {
    return {
      chart: {
        type: 'stackedAreaChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        },
        x: function (d) { return d[0]; },
        y: function (d) { return d[1]; },
        useVoronoi: false,
        clipEdge: true,
        duration: 100,
        interactive: true,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d))
          }
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          }
        },
        zoom: {
          enabled: true,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        },
        dispatch: {
          // stateChange: function (e) { console.log("stateChange"); },
          changeState: function (e) { console.log("changeState"); },
          tooltipShow: function (e) { console.log("tooltipShow"); },
          tooltipHide: function (e) { console.log("tooltipHide"); }
        },
        // stacked: {
        //   dispatch: {
        //     'elementClick': function (e) { console.log('click', e) },
        //     elementMouseover: function (e) { console.log('mouseover') },
        //     elementMouseout: function (e) { console.log('mouseout') },
        //     renderEnd: function (e) { console.log('renderEnd') }
        //   }
        // },
        callback: function (chart) {
          console.log('chart', chart);
          console.log("!!! stackedAreaChart callback !!!");
          chart.stacked.dispatch.on('elementClick', function (e) {
            console.log('elementClick in callback', e);
          });
        }
      }
    };
  }
}

export default HomeController;
