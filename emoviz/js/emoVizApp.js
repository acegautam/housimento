/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is an app for emotion visualization to show how
 * emotions changes over the time.
 *
 * If you are interested in a full version and more details,
 * please see this reference:
 * Jian Zhao, Liang Gou, Fei Wang, Michelle Zhou.
 * PEARL: An Interactive Visual Analytic Tool for
 * Understanding Personal Emotion Style Derived from
 * Social Media. VAST'14: Proceedings of the IEEE
 * Symposium on Visual Analytics Science and Technology,
 * pp. 203-212, Nov 2014.
 *
 * Author: Liang Gou, lgou@us.ibm.com
 * Date: July 20, 2015
 */

/*jslint node: true, jquery: true */
'use strict';

var CUR_TEXT = '',
    CUR_EMOTION_RSLTS,
    EMOTION_RSLTS,
    animateDuration = 250,
    MAX_LINE_COUNT = 500;

//-------------------------------------------------------
// emoTimeline is the visualization module to show the
// emotion changes over the time.
//----------------------------------------------------------
var emoTimeline = new emoViz.emoTimeline()
    .width(900)
    .height(320)
    .emotionCategories(emoViz.emotionCategories)
    .colorSchema(emoViz.emcolors)
    .margin({
        top: 20,
        right: 25,
        bottom: 25,
        left: 40
    });

var emoTimelineSVG = d3.select('#emotion_timeline')
    .append('svg')
    .attr('width', emoTimeline.width())
    .attr('height', emoTimeline.height());

//-------------------------------------------------------
// emoWordle is the visualization module to show the
// emotion words in the input text.
//----------------------------------------------------------

/* not in use any more
var emoWordle=new emoViz.emoWordle()
          .width(340)
          .height(300)
          .emotionCategories(emoViz.emotionCategories)
          .colorSchema(emoViz.emcolors)
          .margin({top: 5, right: 5, bottom: 5, left: 5});

var emoWordleSVG = d3.select('#emotion_words')
    .append('svg')
          .attr('width', emoWordle.width())
          .attr('height', emoWordle.height());

*/

//-------------------------------------------------------
// emoText component show and highlight text.
//-------------------------------------------------------

var emoTextDiv = d3.select('#emotion_text'),
    emoText = new emoViz
    .emoText()
    .emotionCategories(emoViz.emotionCategories);


/////////////////////
// app starts here //
/////////////////////
$(document).ready(function() {


    // TODO
    CUR_TEXT = preproceText(SAMPLE_TEXT);
    $.getJSON("twitterData.json", function( data ) {
        console.log('data', data);
        data = _.sortBy(data, [function(o) { return o.date; }]);
        console.log('sorted data', data);
        CUR_EMOTION_RSLTS = data;        
        vizEmotion(CUR_EMOTION_RSLTS, 1);
    });

    d3.select(window).on('resize', function() {
        if (EMOTION_RSLTS) {
            resizeEmoTimeline();
        }
    });

    function vizEmotion(emodata, currentPage) {

        // emoTimeline.startLineIndex((currentPage - 1) * textCountInPage + 1);
        emoTimelineSVG.datum(emodata)
            .call(emoTimeline);

        emoText.emotionData(emodata);

        emoTextDiv.datum(CUR_TEXT)
            .call(emoText);

        resizeEmoTimeline();
    }

    function resizeEmoTimeline() {

        var rslDiv = d3.select('#emotion_timeline');
        var nw = rslDiv.property('clientWidth') || 900,
            nh = (rslDiv.property('clientHeight') < 200) ? 200 : (rslDiv.property('clientHeight') > 350 ? 350 : rslDiv.property('clientHeight'));

        rslDiv.select('svg')
            .attr('width', nw)
            .attr('height', nh);

        emoTimeline.width(nw)
            .height(nh);

        emoTimelineSVG
            .call(emoTimeline);

    }


    //preprocess text input data
    function preproceText(text) {
        var results = [];
        text.split('\n')
            .forEach(function(ele) {
                if (ele)
                    if (ele.trim() !== '')
                        if (results.length <= MAX_LINE_COUNT) results.push(ele);
            });
        return results;

    }
    //-------------------------------------
    // highlight/unhighlight functions
    //-------------------------------------
    function highlightEmoGenomeByIndex(index) {
        //highlight the corresponding emoGenome bar in the timeline
        var cur = d3.select('#emogenome_index_' + index);

        cur.transition()
            .duration(animateDuration)
            .style('opacity', 1);

        emoTimeline.emoGenome().highlightGenome(cur);
        //fade out the emotion bands
        d3.selectAll('.emobands')
            .style('opacity', 1)
            .transition()
            .duration(animateDuration)
            .style('opacity', 0.25);


        //show tooltips
        //get the sliced data for the current genome
        var pdata = emoTimeline.emoGenome().slicedData()[index];

        //show the popup of the emotion scores at this time:
        var content = '<table class="table">';

        for (var i = pdata.emotions.length - 1; i >= 0; i--) {
            var emo = pdata.emotions[i],
                styleClass = "popup-table-row";
            if (emo.dominant) styleClass += " popup-table-dominant";

            content += '<tr class ="' + styleClass + '">';
            content += '<td style = " color: ' + emoViz.emcolors[emo.emotion] + '">' + emo.emotion + '</td>';
            content += '<td>' + Number(emo.score).toPrecision(2) + '</td>';
            content += '</tr>';
        }

        //Note: the tooltip's position is dependent on its top layer div -'results_row';
        var resultsDivP = $('#results_row').position();

        emoViz.showTooltip([resultsDivP.left + Number(cur.attr('centerX')), resultsDivP.top + Number(cur.attr('centerY'))], content, [100, 20]);
    }

    function unhighlightEmoGenomeByIndex(index) {
        //unhighlight the corresponding emoGenome bar in the timeline

        d3.selectAll('.emogenome').transition()
            .duration(animateDuration)
            .style('opacity', null);

        var cur = d3.select('#emogenome_index_' + index);

        emoTimeline.emoGenome().unhighlightGenome(cur);

        d3.selectAll('.emobands')
            .transition()
            .duration(animateDuration)
            .style('opacity', 1);

        emoViz.hideTooltip();
    }


    //-------------- highlight/unhighlight helpers---------//

    //--------------------------------------------------
    // Setting up all event listeners
    //--------------------------------------------------

    // all event process for emoTimeline:
    emoTimeline.dispatch.on('areaMouseover', function(d) {
        emoViz.showTooltip(d.pos, d.name);
    });

    emoTimeline.dispatch.on('areaMouseout', function(d) {
        emoViz.hideTooltip(d.pos, d.name);
    });

    emoTimeline.dispatch.on('genomeMouseover', function(d) {
        //highlight the text
        d3.select('#text_id_' + d.data.index).attr('class', 'list-group-item list-group-item-success');

        // Show the current text associated with the genome hovered on
        showCurrentText(d.data.index);
    });

    function showCurrentText(index){
        var date = CUR_EMOTION_RSLTS[index].date;
        date = date.substring(5);
        date = date.replace('-', '/');
        var title = ' for ' + date;
        $('.title-text').html(title);
        var text = CUR_EMOTION_RSLTS[index].text;
        var sourceTextBox = $('.source-text-box').html(text);
        // sourceTextBox.animate({ height: "90%" }, 1000 );
    }

    emoTimeline.dispatch.on('genomeMouseout', function(d) {
        //unhighlight the text;
        d3.select('#text_id_' + d.data.index).attr('class', 'list-group-item');
        //unhighlightEmoWordsByIndex();
    });


    // all event process for text:
    emoText.dispatch.on('textMouseover', function(d) {
        highlightEmoGenomeByIndex(d.index);

    });

    emoText.dispatch.on('textMouseout', function(d) {
        unhighlightEmoGenomeByIndex(d.index);

    });
    //-------------- end of event listener setting up---------//

});
