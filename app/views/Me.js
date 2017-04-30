/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, TouchableOpacity, Text, Image,StyleSheet,ScrollView,Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

const window = Dimensions.get('window');

var httpsBaseUrl = "https://slako.applinzi.com/";


const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 12
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    personalinfo:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',

        //主轴方向
        flexDirection:'row',
    },
    headimage: {
        width: 80,
        height: 80,
    },
    bottomTextContainer: {
        width: window.width-20,
        height: 80,
        marginLeft: 10,
        justifyContent: 'space-around',
        //alignItems: 'center',
    },
    bottomText: {
        fontSize: 16,
    },
});

class Me extends Component {

    constructor(props) {
        super(props);

        this.state = {
            auth:"fan",
        };

        this._showAuth = this.showAuth.bind(this);
        this._savemyAuth = this.savemyAuth.bind(this);
    }

    showAuth(){

    }

    savemyAuth(){

    }
    render(){
        var userId = (global.userid);

        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <ScrollView>
                    <TouchableOpacity  onPress={()=>(Actions.personalcenter())} >
                        <View style={styles.personalinfo}>
                            <Image style={styles.headimage} resizeMode="cover" source={{uri:`${httpsBaseUrl}${global.userhead}`}}/>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.bottomText}>昵称：{global.nickname}</Text>
                                <Text style={styles.bottomText}>个人中心</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.list}>
                        <MeItem icon={"ios-medal"} text={"我的主页"} iconColor="#c88400" onPress={() => Actions.homepage({userId})} />
                        <MeItem icon={"md-build"} text={"我的题本"} iconColor="#FF0000"  onPress={() => Actions.mybooklist()} />
                        <MeItem icon={"md-link"} text={"分享管理"} onPress={() => Actions.sharemanager()} />
                        <MeItem icon={"md-heart"} text={"我的收藏"} subText={"10篇"} iconColor="#32cd32" />
                        <MeItem icon={"md-sync"} text={"更新"} onPress={() => Actions.mybooklist()} />
                        <MeItem icon={"md-settings"} text={"设置"} iconColor="#ea66a6" onPress={() => Actions.setting()} />
                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = Me;