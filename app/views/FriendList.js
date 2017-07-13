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
    },
    leftImgStyle:{
        width:60,
        height:60,
        marginRight:15
    },
    topTitleStyle:{
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
});

var getFrieldUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getfriendlist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class FriendList extends Component {



    constructor(props) {
        super(props);

        this.state = {
            gorefreshing:false,
            friend_list_data_source: null,
            getdata:null
        };
        this._renderPeople = this.renderPeople.bind(this);
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
                    this.setState({
                        friend_list_data_source:responseData.data,
                        gorefreshing:false,
                        getdata:1
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

    renderPeople(people){
        var userId = (people.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId:userId,title:people.nickname,peopledata:people})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${people.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {people.nickname}
                        </Text>
                        <Text >
                            标签：
                        </Text>
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
                    renderRow={(rowData) => this._renderPeople(rowData)}
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

};

module.exports = FriendList;