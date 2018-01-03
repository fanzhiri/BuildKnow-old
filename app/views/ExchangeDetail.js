/**
 * Created by slako on 18/01/02.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,ListView,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },beginButton:{
        width:window.width,
        backgroundColor: '#00EE00'
    },
    textdesc:{
        fontSize:24,
        marginTop:12
    },
    buttonContainer:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    saveContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
    },
    saveButton:{
        width:100,
        backgroundColor: '#00EE00'
    },

});

var doGetExchangeDetailUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getexchangedetail";

class ExchangeDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {

            exchangedetail_data:null,
            getdata:0,
            gorefreshing:false
        };
        this._renderRecordItem = this.renderRecordItem.bind(this);

    }

    doFetchExchangeDetai(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);


        let opts = {
            method:"POST",
            body:formData
        };
        fetch(doGetExchangeDetailUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        exchangedetail_data:responseData.data.reverse(),
                        getdata:1
                    })

                }else{
                    alert(responseData.message);
                    this.setState({
                        getdata:1
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderRecordItem(rowData,sectionID, rowID){
        //let time_o = new Date(rowData.begintime * 1000);

        //let time_t = time_o.toLocaleString();
        let inout ="收入";
        let inoutcolor = "#00FF00"
        if(rowData.addsub == 1){
            inout ="支出";
            inoutcolor = "#FF0000"
        }
        let extype ="红包";
        if(rowData.extype == 1){
            extype ="转账";
        }
        return(
            <View style={{
                height:68,
                borderBottomWidth:1,
                borderBottomColor:'#e464e4',
                }}>
                <Text>{rowID} </Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{color:"#0000FF"}}>{extype}  </Text>
                    <Text>时间:{rowData.time }  </Text>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{color:inoutcolor}}>{inout}:{rowData.vc}  </Text>
                    <Text>余额:{rowData.remain }  </Text>
                </View>
            </View>
        )
    }

    renderPage(){
        if(this.state.getdata == 0){
            this.doFetchExchangeDetai();
            return(<LoadingData/>)
        }else{
            if(this.state.exchangedetail_data == null){
                return(<EmptyData/>)
            }else{
                return(this.renderRecordList())
            }
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderPage()}
            </View>
        )
    }

    renderRecordList(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.doFetchExchangeDetai()}
                    />
                }
                style={{flex:1,margin:6}}
                dataSource={DataStore.cloneWithRows(this.state.exchangedetail_data)}
                renderRow={this._renderRecordItem}
                enableEmptySections = {true}
            />

        );
    }

}

module.exports = ExchangeDetail;