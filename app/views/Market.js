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
import DataStore from '../util/DataStore';

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

var doGetPublickBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getbookstore";

class Market extends Component {


    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            newbookdataSource:null,
            dataSource1: ds.cloneWithRows(Marketlistdata),
            dataSource2: ds.cloneWithRows(Marketlistdata),
            dataSource3: ds.cloneWithRows(Marketlistdata),
            dataSource4: ds.cloneWithRows(Marketlistdata),
            dataSource5: ds.cloneWithRows(Marketlistdata)
        };
        this._renderRow = this.renderRow.bind(this);
        //this._renderRow2 = this.renderRow2.bind(this);
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <MarketListItem
                rowID={rowID}  cover={rowData.cover} bookname={rowData.bookname} book={rowData}/>
        );
    }



    renderNewBookView(){
        if(this.state.newbookdataSource == null){
            this.fetchBookStorelist(1);

        }else{
            return(
                <View>
                    <Text style={styles.title} >最新审核</Text>
                    <ListView
                        enableEmptySections={true}
                        horizontal={true}
                        dataSource={DataStore.cloneWithRows(this.state.newbookdataSource)}
                        renderRow={this._renderRow} />
                </View>
            );
        }

    }

    fetchBookStorelist(type){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("type",type);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetPublickBookPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        newbookdataSource:responseData.data
                    })
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
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

                    {this.renderNewBookView()}

                <Text style={styles.title} >本周排行</Text>

                <Text style={styles.title} >本月排行</Text>

                <Text style={styles.title} >年度排行</Text>

                <Text style={styles.title} >收费排行</Text>

                <Text style={styles.title} >热门推荐</Text>

                </ScrollView>
            </View>
        );
    }
}

module.exports = Market;