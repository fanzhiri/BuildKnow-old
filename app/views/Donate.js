/**
 * Created by slako on 17/10/27.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

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
class Donate extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={{alignItems:"center"}}>
                    <Text style={{fontSize:18,margin:20}}>    如果您感觉【buildquestion】能够帮助您，如果您有意向支持我们发展得越来越好，如下是捐赠的方式，受捐资产将会全部投入到服务器运营，感谢。</Text>
                    <Image style={{width:200,height:200}} resizeMode="cover" source={{uri:`${httpsPicBaseUrl}${danate_weixin}`}}/>
                </View>
            </View>
        );
    }
}

Donate.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = Donate;
