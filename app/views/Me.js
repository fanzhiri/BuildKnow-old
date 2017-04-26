/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, TouchableOpacity, Text, Image,StyleSheet,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

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
        width: 80,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 16,
        justifyContent: 'center',
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

        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                {/*<Button onPress={() => Actions.setting()}>设置</Button>*/}
                {/*<Button onPress={() => Actions.homepage()}>我的主页</Button>*/}
                {/*<Button onPress={() => Actions.mybooklist()}>我的题本</Button>*/}
                {/*<Button onPress={() => this._savemyAuth()}>save auth</Button>*/}
                {/*<Button onPress={() => this._showAuth()}>show auth</Button>*/}

                <ScrollView>
                    <TouchableOpacity  onPress={()=>(Actions.personalcenter())} >
                        <View style={styles.personalinfo}>
                        <Image style={styles.headimage} resizeMode="cover" source={{uri:'https://slako.applinzi.com/statics/images/question/head/boy/1.jpg'}}/>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.bottomText}>name</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.list}>
                        <MeItem icon={"md-settings"} text={"我的主页"} onPress={() => Actions.homepage()} />
                        <MeItem icon={"md-settings"} text={"我的题本"} onPress={() => Actions.mybooklist()} />
                        <MeItem icon={"md-heart"} text={"我的收藏"} subText={"15篇"} iconColor="#32cd32" />
                        <MeItem icon={"md-settings"} text={"设置"} onPress={() => Actions.setting()} />

                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = Me;