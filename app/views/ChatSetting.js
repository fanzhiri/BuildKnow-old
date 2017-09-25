/**
 * Created by slako on 17/09/25.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,ScrollView,SegmentedControlIOS,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

import ImagePicker from "react-native-image-picker";

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
    itemcontainer: {
        flexDirection:'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#F5FCFF',
        paddingLeft:8,
        paddingRight:8,
        marginTop:4
    },
    segmentcontainer: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 40,
    },
    segmented:{
        width:160,
    },typetext:{

    }
});

class ChatSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            peoples_data_source:null
        };
        this._onChange = this.onChange.bind(this);
        this._renderPeopleItem =this.renderPeopleItem.bind(this);
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    renderPeople(){
        return(
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.peoples_data_source)}
                renderRow={this._renderPeopleItem}
                enableEmptySections = {true}
            />
        )
    }

    renderFragment(){
        if(this.state.selectedIndex == 0){
            return(this.renderPeople())
        }else{
            return(this.renderGroupChatSet())
        }
    }

    renderGroupChatSet(){
        return(
            <View>
                <SettingItem text={"群聊名称"} />
                <SettingItem text={"群二维码"} />
                <SettingItem text={"群公告"} />
                <SettingItem text={"消息免打扰"} />
                <SettingItem text={"保存到通讯录"} />
                <SettingItem text={"我在本群的昵称"} />
                <SettingItem text={"显示群成员的昵称"} />
            </View>
        )
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['用户','设置']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderFragment()}
            </View>
        );
    }
    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }
}

ChatSetting.PropTypes = {
    chattoid:PropTypes.number,
};

module.exports = ChatSetting;