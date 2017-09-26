/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, ScrollView,RefreshControl,TouchableOpacity,Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper'
import GlobleStyles from '../styles/GlobleStyles';
import FoldView from 'react-native-foldview';
import Icon from 'react-native-vector-icons/Ionicons';

import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop:64,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    peopleItem:{
        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems:"center"
    },
    leftImgStyle:{
        width:40,
        height:40,
        marginRight:15
    },
    topTitleStyle:{
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },selectbutton:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-end',
    },
});

var getFrieldUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getfriendlist";

var addPeopleCvstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addpeoplecvst";
var sendMsgUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=sendmsg";

var httpsBaseUrl = "https://slako.applinzi.com/";

class FriendList extends Component {



    constructor(props) {
        super(props);

        this.state = {
            gorefreshing:false,
            friend_list_data_source: null,
            getdata:null,
            whoinselect:null
        };
        this._renderPeople = this.renderPeople.bind(this);
        this._endAction = this.endAction.bind(this);
    }

    fetch_addPeopleToCvst(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("chat_id",this.props.cvst_id);
        let userids = new Array();
        for(let i=0;i<this.state.friend_list_data_source.length;i++){
            if(this.state.whoinselect[i]== 1){
                userids.push(this.state.friend_list_data_source[i].userid);
            }
        }
        formData.append("useridlist",JSON.stringify(userids));

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(addPeopleCvstUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Actions.pop();

                }else{
                    alert(responseData.data)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_sendPeopleCard(rowData){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("attachmentid",rowData.userid);
        formData.append("conversationid",this.props.cvst_id);
        formData.append("chattoid",this.props.chattoid);
        formData.append("msg_type",1);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sendMsgUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(responseData.data)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    endAction(){
        if(this.props.option == 0){

        }else{
            this.fetch_addPeopleToCvst()
        }
    }

    componentWillMount(){
        if(this.props.inmode == 1 && this.props.intype == 0){
            Actions.refresh({rightTitle:"添加",onRight:this._endAction});
        }
    }

    fetchfriendlist(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getFrieldUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    let whoinselect_arr = null;
                    if(responseData.data == null){

                    }else{
                        whoinselect_arr= new Array([responseData.data.length]);
                    }
                    this.setState({
                        friend_list_data_source:responseData.data,
                        gorefreshing:false,
                        getdata:1,
                        whoinselect:whoinselect_arr
                    })

                }else{
                    this.setState({
                        netresult:responseData.code,
                        getdata:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    getdatafirst(){
        if(this.state.getdata == null){
            this.fetchfriendlist();
            return (this.renderLoading())
        }else{
            if(this.state.getdata == 1){
                return (this.renderfriendlistView())
            }else{
                return (this.rendernodata())
            }
        }
    }

    changeselect(where){
        let t_whoinselect = this.state.whoinselect;
        t_whoinselect[where] = (t_whoinselect[where] == 1)?0:1;
        this.setState({
            whoinselect:t_whoinselect,
        })
    }

    rendertake(where){
        if(this.props.inmode == 1 && this.props.intype == 0){
            if(this.state.whoinselect[where] == 1){
                return(
                    <Icon name={"md-checkbox-outline"}  size={22} color="#008B00"/>
                )
            }else{
                return(
                    <Icon name={"md-expand"}            size={22} color="#008B00"/>
                )
            }
        }
    }

    onPeopleClick(rowData, sectionID, rowID){
        if(this.props.inmode == 0){
            Actions.homepage({userId:rowData.userid,title:rowData.nickname,peopledata:rowData})
        }else{
            if(this.props.intype == 0){
                this.changeselect(rowID);
            }else{
                this.fetch_sendPeopleCard(rowData);
            }

        }
    }

    renderPeople(rowData, sectionID, rowID){

        return (

            <TouchableOpacity onPress={() => this.onPeopleClick(rowData, sectionID, rowID)}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.nickname}
                        </Text>
                    </View>
                    <View style={styles.selectbutton}>
                        {this.rendertake(rowID)}
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    renderfriendlistView(){
        return (
            <View>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.gorefreshing}
                            onRefresh={() => this.fetchfriendlist()}
                        />
                    }
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.friend_list_data_source)}
                    renderRow={this._renderPeople}
                    enableEmptySections = {true}
                />
            </View>

        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.getdatafirst()}
            </View>
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>加载中...</Text>
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

FriendList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number.isRequired,//0群聊添加人，1发送名片
    option: PropTypes.number.isRequired,//0删除，1添加
    cvst_id: PropTypes.number.isRequired,//增加、删除会话人时用
    chattoid:PropTypes.number,

};

module.exports = FriendList;