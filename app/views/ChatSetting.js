/**
 * Created by slako on 17/09/25.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,ScrollView,SegmentedControlIOS,ListView,Image,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

import ImagePicker from "react-native-image-picker";
import DataStore from '../util/DataStore';

var httpsBaseUrl = "https://slako.applinzi.com/";

const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 6
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

    },peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
    addButton: {
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    }
});

var doGetChatInfoUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getchatinfo";
var httpsBaseUrl = "https://slako.applinzi.com/";

class ChatSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            peoples_data_source:null,
            get_people_data:0,
            chat_data_source:null,
            get_chat_data:0,
            cvst_id:props.chat_id
        };
        this._onChange = this.onChange.bind(this);
        this._renderPeopleItem =this.renderPeopleItem.bind(this);
    }

    dofetch_chatdata(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("chat_id",this.state.cvst_id);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetChatInfoUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        chat_data_source:responseData.data,
                        peoples_data_source:responseData.data.peopledetial,
                        get_chat_data:1
                    })
                }else{
                    alert(responseData.message);
                    this.setState({
                        get_chat_data: 2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    renderPeopleItem(rowData,sectionID, rowID){
        var userId = (rowData.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId:userId,title:rowData.nickname,peopledata:rowData})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${rowData.head}`}} style={{width:40, height:40, marginRight:15}}/>
                    <View>
                        <Text style={{fontSize:20, marginBottom:10}}>
                            {rowData.nickname}
                        </Text>
                        <Text >
                            粉丝:{rowData.follow} 内测:{rowData.buildingshare} 在建:{rowData.buildingshare}  发布:{rowData.releaseshare}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    addPeople(what){
        Actions.friendlist({inmode:1,option:what,cvst_id:this.state.cvst_id});
    }

    renderPeople(){
        if(this.state.get_chat_data == 0){
            this.dofetch_chatdata();
            return this.renderLoading();
        }if(this.state.peoples_data_source == null){
            return this.rendernodata();
        }

        return(
            <View style={{flex:1}}>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addPeople(1)} activeOpacity={0.8}>
                    <Icon name={"md-add-circle"} size={22} color="#008B00"/>
                    <Text style={{marginLeft:8}}>添加会话人</Text>
                </TouchableOpacity>
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.peoples_data_source)}
                    renderRow={this._renderPeopleItem}
                    enableEmptySections = {true}
                />
                <TouchableOpacity style={styles.addButton} onPress={() => this.addPeople(0)} activeOpacity={0.8}>
                    <Icon name={"md-close-circle"} size={22} color="#FF0000"/>
                    <Text style={{marginLeft:8}}>删除会话人</Text>
                </TouchableOpacity>
            </View>

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
            <ScrollView style={{flex:1}}>
                <SettingItem text={"群聊名称"} />
                <SettingItem text={"群二维码"} />
                <SettingItem text={"群公告"} />
                <SettingItem text={"消息免打扰"} />
                <SettingItem text={"保存到通讯录"} />
                <SettingItem text={"我在本群的昵称"} />
                <SettingItem text={"显示群成员的昵称"} />
            </ScrollView>
        )
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['用户','设置']}
                        selectedIndex={this.state.selectedIndex}
                        style={{width:240,alignSelf:'center',marginTop:6,marginBottom:6}}
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
    rendernodata(){
        return (
            <View style={styles.container}>
                <Text>没有数据</Text>
            </View>
        )
    }
}

ChatSetting.PropTypes = {
    chat_id:PropTypes.number,
};

module.exports = ChatSetting;