/**
 * Created by slako on 17/10/27.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,ListView,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {checkerrorcode } from '../util/CheckNetError'
import DataStore from '../util/DataStore';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";
var danate_weixin ="currency/donate/weixindonate.pic.jpeg";
var doGetDonateUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=donate";

class Donate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            donates_data_source: null,
        };
        this._renderDonateItem = this.renderDonateItem.bind(this);
    }

    componentDidMount(){
        this.dofetchDonate();
    }

    dofetchDonate(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetDonateUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        donates_data_source:responseData.data
                    })

                }else{
                    checkerrorcode(responseData);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderDonateItem(rowData, sectionID, rowID){
        return(
            <View style={{flexDirection:"row",height:32,alignItems:"center"}}>
                <Text style={{flex:1}}>{rowData.id}</Text>
                <Text style={{flex:1}}>{rowData.fakename}</Text>
                <Text style={{flex:1}}>{rowData.money}</Text>
                <Text style={{flex:1}}>{rowData.words }</Text>
            </View>
        )
    }

    renderDonateList(){
        if(this.state.donates_data_source == null){
            return;
        }
        return(
            <ScrollView style={{margin:20}}>
                <ListView
                    style={{flex:1}}
                    dataSource={DataStore.cloneWithRows(this.state.donates_data_source)}
                    renderRow={this._renderDonateItem}
                    enableEmptySections = {true}
                />
            </ScrollView>

        )
    }
    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View  style={{alignItems:"center"}}>
                    <Text style={{fontSize:18,margin:20}}>    如果您感觉【buildquestion】能够帮助您，如果您有意向支持我们发展得越来越好，如下是捐赠的方式，受捐资产将会全部投入到服务器运营，感谢。</Text>
                    <Image style={{width:200,height:200}} resizeMode="cover" source={{uri:`${httpsPicBaseUrl}${danate_weixin}`}}/>

                </View>
                {this.renderDonateList()}
            </View>

        );
    }
}

Donate.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = Donate;
