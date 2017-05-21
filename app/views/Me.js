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
    settingItemList:{
        marginBottom:48
    }

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

    renderAdmin(){
        if(global.adminid != 0){
            return (
                <MeItem icon={"md-infinite"} text={"管理者"} iconColor="#008B00" onPress={() => Actions.admin()} />
            )
        }
    }

    render(){
        var userId = (global.userid);

        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <ScrollView style={styles.settingItemList}>
                    <TouchableOpacity  onPress={()=>(Actions.personalcenter())} >
                        <View style={styles.personalinfo}>
                            <Image style={styles.headimage} resizeMode="cover" source={{uri:`${httpsBaseUrl}${global.userhead}`}}/>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.bottomText}>昵称：{global.nickname}</Text>
                                <Text style={styles.bottomText}>学术等级:10</Text>
                                <Text style={styles.bottomText}>个人中心</Text>
                                <Text style={styles.bottomText}>用户id:{global.userid}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.list}>
                        {this.renderAdmin()}
                        <MeItem icon={"ios-medal"} text={"我的主页"} iconColor="#c88400" onPress={() => Actions.homepage({userId})} />
                        <MeItem icon={"md-build"} text={"我的题本"} iconColor="#FF0000"  onPress={() => Actions.mybooklist()} />
                        <MeItem icon={"md-cube"} text={"答案库"} iconColor="#D15FEE"  onPress={() => Actions.answerlib()} />
                        <MeItem icon={"md-link"} text={"分享管理"} onPress={() => Actions.sharemanager()} />
                        <MeItem icon={"md-heart"} text={"我的收藏"} subText={"10篇"} iconColor="#32cd32" onPress={() => Actions.mycollectbooklist()} />
                        <MeItem icon={"md-sync"} text={"更新"}  subText={"4本"} onPress={() => Actions.mybooklist()} />
                        <MeItem icon={"md-mail"} text={"消息"}  subText={"10条"} iconColor="#1e90ff" onPress={() => Actions.messagelist()} />
                        <MeItem icon={"md-podium"} text={"数据"} iconColor="#7fff00" onPress={() => Actions.statistics()} />
                        <MeItem icon={"md-time"} text={"日程"} iconColor="#912CEE" onPress={() => Actions.schedule()} />
                        <MeItem icon={"md-notifications"} text={"通知"} iconColor="#1C86EE" onPress={() => Actions.notificationlist()} />
                        <MeItem icon={"md-settings"} text={"设置"} iconColor="#ea66a6" onPress={() => Actions.setting()} />

                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = Me;