/**
 * Created by slako on 17/5/8.
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

import {PicBaseUrl} from '../util/Attributes';
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

class Admin extends Component {

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
                <MeItem icon={"md-infinite"} text={"管理者"} iconColor="#008B00" onPress={() => Actions.setting()} />
            )
        }
    }

    render(){
        var adminId = (global.adminid);

        return (
            <View style={{flex: 1, marginTop:64,backgroundColor:"#FFEC8B"}}>

                <ScrollView >

                        <View style={styles.personalinfo}>
                            <Image style={styles.headimage} resizeMode="cover" source={{uri:`${PicBaseUrl}${global.userhead}`}}/>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.bottomText}>昵称：{global.nickname}</Text>
                                <Text style={styles.bottomText}>管理等级：{adminId}</Text>
                             </View>
                        </View>

                    <View style={styles.list}>
                        <MeItem icon={"md-basketball"}  text={"数据统计"} iconColor="#A020F0"  onPress={() => Actions.serverdata()}  />
                        <MeItem icon={"md-lock"}        text={"人员权限"} iconColor="#0A0A0A"  onPress={() => Actions.memberlist()}  />
                        <MeItem icon={"md-pizza"}       text={"内容管理"} iconColor="#7FFF00"  onPress={() => Actions.booklist({inmode:0})} />
                        <MeItem icon={"md-bowtie"}      text={"推荐管理"} iconColor="#00EEEE"  onPress={() => Actions.marketmanage()} />
                        <MeItem icon={"md-film"}        text={"发布审核"} iconColor="#FF0000"  onPress={() => Actions.releasereview()} />
                        <MeItem icon={"md-contacts"}    text={"注册审核"} iconColor="#D15FEE"  onPress={() => Actions.registerverify()} />
                        <MeItem icon={"md-boat"}        text={"企业进驻"} iconColor="#76EE00"  onPress={() => Actions.enterpriseenter()} />
                        <MeItem icon={"md-cafe"}        text={"捐助入册"} iconColor="#6959CD"  onPress={() => Actions.donate()} />
                        <MeItem icon={"md-baseball"}    text={"权限管理"} iconColor="#1E90FF"   />
                        <MeItem icon={"md-umbrella"}    text={"活动组织"} iconColor="#8B2500"   />
                        <MeItem icon={"md-school"}      text={"成就编辑"} iconColor="#282828"   />
                        <MeItem icon={"md-filing"}      text={"意见建议"} iconColor="#76EE00"   />
                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = Admin;
