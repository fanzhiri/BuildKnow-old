/**
 * Created by slako on 17/4/26.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

import ImagePicker from "react-native-image-picker";

var httpsBaseUrl = "https://slako.applinzi.com/";
var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";
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

});

class PersonalCenter extends Component {

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

        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <ScrollView>

                    <View style={styles.list}>
                        <SettingItem text={"头像"} subText={"未设置"} imgUri={`${httpsPicBaseUrl}${global.userhead}`} onPress={() => Actions.setheadpic()}/>
                        <SettingItem text={"主页背景"} imgUri={`${httpsBaseUrl}${global.userhead}`} onPress={() => Actions.sethomepagepic()}/>
                        <SettingItem text={"昵称"} subText={global.nickname} onPress={()=>Actions.attributechange({attribute:1})}/>
                        <SettingItem text={"建识号"} subText={global.username}/>
                        <SettingItem text={"二维码名片"} />
                        <SettingItem text={"我的地址"} subText={"未设置"}  />
                    </View>
                    <View style={styles.list}>
                        <SettingItem text={"绑定新浪微博"} subText={"未设置"} isHasSwitcher={true}/>
                        <SettingItem text={"绑定微信"} subText={"未设置"} isHasSwitcher={true}/>
                    </View>
                    <View style={styles.list}>
                        <SettingItem text={"邮箱"} subText={"未设置"}/>
                        <SettingItem text={"手机号"} subText={"未设置"}  onPress={()=>Actions.attributechange({attribute:2})}/>
                    </View>

                    <View style={styles.list}>

                        <SettingItem text={"性别"} onPress={() => Actions.about()}/>
                        <SettingItem text={"地区"} onPress={() => Actions.help()}/>
                        <SettingItem text={"个性签名"} onPress={()=>Actions.attributechange({attribute:3})}/>

                    </View>
                    <View style={styles.list}>

                        <SettingItem text={"密码更改"} onPress={() => Actions.changepasswd()}/>

                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = PersonalCenter;