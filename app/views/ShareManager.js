/**
 * Created by slako on 17/4/27.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,ListView,} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    shareWayItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
});

var doGetShareWayUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getshareway";
var httpsBaseUrl = "https://slako.applinzi.com/";

class ShareManager extends Component {
    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            share_list_data_source: null,

        };
        //this._onChange = this.onChange.bind(this);
        //this._peoplelist = this.peoplelist.bind(this);
        this._renderShareWayItem = this.renderShareWayItem.bind(this);
        //this._doOnPress = this.doOnPress.bind(this);

    }

    fetchShareWayData(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetShareWayUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        share_list_data_source:responseData.data
                    })
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderShareWayItem(way){

        return (
            <View style={styles.shareWayItem}>
                <View>
                    <Text >
                        {way.name}
                    </Text>
                    <Text >
                        {way.passwd}
                    </Text>
                </View>
            </View>
        )
    }

    render(){
        if(this.state.share_list_data_source){
            return (this.renderShareWay())
        }else{
            //this.fetchShareWayData();
            return (this.renderLoading())
        }
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderShareWay(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ListView
                    dataSource={DataStore.cloneWithRows(this.state.share_list_data_source)}
                    renderRow={(rowData) => this._renderShareWayItem(rowData)}
                    enableEmptySections = {true}
                />
            </View>
        );
    }
}

module.exports = ShareManager;