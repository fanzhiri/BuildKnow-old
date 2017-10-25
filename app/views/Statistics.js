/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,ScrollView,WebView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";

import NativeEcharts from 'native-echarts';
import Echarts from 'echarts';
import GlobleStyles from '../styles/GlobleStyles';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apple:[2, 4, 7, 2, 2, 7, 13, 16],
            organ: [6, 9, 9, 2, 8, 7, 17, 18],
        }
    }

    getVirtulData(year) {

        var date = +Echarts.number.parseDate(year + '-01-01');
        var end = +Echarts.number.parseDate((+year) + '-01-30');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
        //for (var time = 0; time < 100; time += 1) {
            data.push([
                Echarts.format.formatTime('yyyy-MM-dd', time),
                Math.floor(Math.random() * 100)
            ]);
        }
        //alert(data);
        return data;
    }

    render(){


        let tdata=this.getVirtulData(2017);
        option = {
            tooltip: {
                position: 'top'
            },
            visualMap: {
                min: 0,
                max: 100,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                top: 'top'
            },

            calendar:
                {
                    range: '2017',
                    cellSize: [20, 20]
                },

            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 0,
                data: tdata
            }

        };
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <WebView
                    source={{
                        uri: "http://slako.applinzi.com/index.php?m=question&c=index&a=echarts",
                        method: 'GET'
                    }}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                />
            </View>

        );
    }
}

module.exports = Statistics;