class HomeController {
  /* @ngInject */

  constructor(HomeService, $mdDialog) {
    this.name = 'Home Screen';
    this.$mdDialog = $mdDialog
    this.homeService = HomeService;
    this.init();
  }


  init() {
    this.getSentimentData();
  }

  getInfo(){
    this.homeService.getInfo().then((response) => {
      console.log('al info =>', response.data);
    })
  }
  getSentimentData(){
    this.homeService.getSentimentData().then((response) =>{
      this.data = response.data;
      this.info = this.data.entities;
      // this.info = this.info.slice(0, 6);
      this.sinfo = this.parseSentimentData();
      console.log('this.info', this.info);
      console.log('this.sinfo', this.sinfo);
      this.setChartData();
    });
  }

  parseSentimentData(){
    let colors = ['#fbdf5f', '#4aad62', '#e74565'];
    let keys = ['joy', 'fear', 'anger'];
    let array1 = [], array2 = [], array3 = [];
    let mainArray = [array1, array2, array3];
    let data = keys.map((key, i) => {
      this.info.forEach((item, j) => {
        if(!item.emotions){
          return;
        }
        mainArray[i].push({
          'series': i,
          'x': j,
          'y': item.emotions[keys[i]]
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

  setChartData() {
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

    // this.data = this.sinAndCos();
    this.data = this.sinfo;
    console.log(this.data);
  }
}

export default HomeController;
