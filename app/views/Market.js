/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ListView, ScrollView, Image,RefreshControl,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper';
import MarketListItem from '../component/MarketListItem';
import Marketlistdata from '../testdata/Marketlist.json'
import DataStore from '../util/DataStore';
import GlobleStyles from '../styles/GlobleStyles';

import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

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

        flex: 1,
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

//var doGetPublickBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getbookstore";

var doGetPublickBookPostUrl = "http://slako-buildqst.stor.sinaapp.com/platform/store/recommend/today.json";
var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";



class Market extends Component {


    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            store_data_source:null,
            gorefreshing:false,
            get_storedata:0
        };
        this._renderStoreItem       = this.renderStoreItem.bind(this);
        this._renderPrevHoriRow     = this.renderPrevHoriRow.bind(this);
    }

    renderImage(store_data_item){
        let imageViews=[];
        for(let i=0;i< store_data_item.sub_item.length;i++){
            imageViews.push(

                    <Image
                        key={i}
                        style={styles.imgCarousel}
                        source={{uri:`${httpsPicBaseUrl}${store_data_item.sub_item[i].poster}`}}

                    />

            );
        }
        return imageViews;
    }

    renderPrevHoriRow(rowData, sectionID, rowID){
        return(
            <View>
                <MarketListItem
                    rowID={rowID}  cover={rowData.cover} bookname={rowData.name} book={rowData}/>
            </View>
        )
    }

    renderStoreItem(rowData, sectionID, rowID){

        switch (this.state.store_data_source[rowID].type){
            case 0 :
                return(
                    <View>
                        <Swiper height={200} loop={true} autoplay={true}>

                                {this.renderImage(this.state.store_data_source[rowID])}

                        </Swiper>
                    </View>
                )
                break;
            case 1 :
                return(
                    <View>
                        <Text style={styles.title} >{this.state.store_data_source[rowID].name}</Text>
                        <ListView
                            enableEmptySections={true}
                            horizontal={true}
                            dataSource={DataStore.cloneWithRows(this.state.store_data_source[rowID].sub_item)}
                            showsHorizontalScrollIndicator={false}
                            renderRow={this._renderPrevHoriRow} />
                    </View>
                )
                break;
            case 2 :break;
        }


    }


    fetchtoday(){

        var opts = {
            method:"GET",
        }
        fetch(doGetPublickBookPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                    this.setState({
                        store_data_source:responseData,
                        get_storedata:1
                    })
            })
            .catch((error) => {
                alert(error)
            })
    }
    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,{marginBottom:48}]}>
                {this.renderList()}
            </View>
        )
    }

    renderList(){
        if(this.state.store_data_source == null){
            if(this.state.get_storedata == 0){
                this.fetchtoday();
                return(<LoadingData/>)
            }else{
                return(<EmptyData/>)
            }
        }else{
            return(
                    <ListView
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.store_data_source)}
                        renderRow={this._renderStoreItem}
                        enableEmptySections = {true}
                    />
                )

        }

    }
}

module.exports = Market;