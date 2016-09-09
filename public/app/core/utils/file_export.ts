///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';

declare var window: any;

export function exportSeriesListToCsv(seriesList) {
    var text = 'sep=;\nSeries;Time;Value\n';
    _.each(seriesList, function(series) {
        _.each(series.datapoints, function(dp) {
            text += escapeCsv(series.alias) + ';' + escapeCsv(new Date(dp[1]).toISOString()) + ';' + dp[0] + '\n';
        });
    });
    saveSaveBlob(text, 'grafana_data_export.csv');
};

export function exportSeriesListToCsvColumns(seriesList) {
    var text = 'sep=;\nTime;';
    // add header
    _.each(seriesList, function(series) {
        text += escapeCsv(series.alias) + ';';
    });
    text = text.substring(0,text.length-1);
    text += '\n';

    // process data
    var dataArr = [[]];
    var sIndex = 1;
    _.each(seriesList, function(series) {
        var cIndex = 0;
        dataArr.push([]);
        _.each(series.datapoints, function(dp) {
            dataArr[0][cIndex] = new Date(dp[1]).toISOString();
            dataArr[sIndex][cIndex] = dp[0];
            cIndex++;
        });
        sIndex++;
    });

    // make text
    for (var i = 0; i < dataArr[0].length; i++) {
        text += escapeCsv(dataArr[0][i]) + ';';
        for (var j = 1; j < dataArr.length; j++) {
            text += escapeCsv(dataArr[j][i]) + ';';
        }
        text = text.substring(0,text.length-1);
        text += '\n';
    }
    saveSaveBlob(text, 'grafana_data_export.csv');
};

export function exportTableDataToCsv(table) {
    var text = '';
    // add header
    _.each(table.columns, function(column) {
        text += escapeCsv(column.text) + ';';
    });
    text += '\n';
    // process data
    _.each(table.rows, function(row) {
        _.each(row, function(value) {
            text += escapeCsv(value) + ';';
        });
        text += '\n';
    });
    saveSaveBlob(text, 'grafana_data_export.csv');
};


function escapeCsv(value){
    if (null == value) {
      return '';
    } else {
      return (value + '').split(";").join(",");
    }
}

export function saveSaveBlob(payload, fname) {
    var blob = new Blob([payload], { type: "text/csv;charset=utf-8" });
    window.saveAs(blob, fname);
};
