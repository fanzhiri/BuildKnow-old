/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ListView, ScrollView, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper';
import MarketListItem from '../component/MarketListItem';
import Marketlistdata from '../testdata/Marketlist.json'

//var Marketlistdata = require('../testdata/Marketlist.json');

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#F5FCFF',
        marginTop:64,
        height:548
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    imgCarousel:{
        width:380,
        height:200,
        resizeMode:'cover',
    },
    title:{
        marginTop:16,
        marginBottom:8,
        marginLeft:8,
        color: 'red',
        fontSize: 24,
    }
});

class Market extends Component {


    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {

            dataSource: ds.cloneWithRows(Marketlistdata)
        };
        this.renderRow = this.renderRow.bind(this);

    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <MarketListItem

                rowID={rowID}  cover={rowData.cover} name={rowData.name} />
        );
    }



    render(){
        return (
            <View style={styles.container}>
                <ScrollView >
                <Swiper height={200} loop={true} autoplay={true}>
                    <View style={styles.slide} >
                        <Image source={require('../image/market/carousel/1.jpg')} style={styles.imgCarousel}></Image>

                    </View>
                    <View style={styles.slide}>
                        <Image source={require('../image/market/carousel/2.jpg')} style={styles.imgCarousel}></Image>
                    </View>
                    <View style={styles.slide}>
                        <Image source={require('../image/market/carousel/3.jpg')} style={styles.imgCarousel}></Image>
                    </View>
                </Swiper>

                <Text  style={styles.title} onPress={()=>(Actions.bookcover())} >本周排行</Text>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                <Text style={styles.title} >本月排行</Text>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                <Text style={styles.title} >年度排行</Text>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                <Text style={styles.title} >收费排行</Text>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                <Text style={styles.title} >热门推荐</Text>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                </ScrollView>
            </View>
        );
    }
}

module.exports = Market;