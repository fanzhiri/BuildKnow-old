/**
 * Created by slako on 1711/09.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';
import {PicBaseUrl} from '../util/Attributes';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    list:{
        marginBottom:0
    },
    listItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems: 'center',
    },
    rightViewStyle:{
        //主轴对齐方式
        justifyContent:'center'

    },
    leftImgStyle:{
        width:60,
        height:60,
        marginRight:15
    },
    topTitleStyle: {
        fontSize:16,
        marginBottom:10
    },statusText: {
        fontSize: 14,
        justifyContent: 'center',
        color: 'red',
    },
    numText: {
        fontSize: 20,
        marginRight:10,
        justifyContent: 'center',
        color: 'red',
    },
});

var doGetAchieveUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getachieve";
var httpsBaseUrl = "https://slako.applinzi.com/";

class AchievementList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            achieve_data_source: null,
            get_achieve_data:0,
            gorefreshing:false,
        };

        this._renderAchieveItem = this.renderAchieveItem.bind(this)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gorefresh == null){
            return;
        }
        this.dofetch_mybooks();
    }

    dofetch_myAchieve(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetAchieveUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        achieve_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderMyAchieveView(){
        if(this.state.achieve_data_source == null){
            if(this.state.get_achieve_data == 0){
                this.dofetch_myAchieve();
                return (<LoadingData/>)
            }else{
                return(<EmptyData/>)
            }

        }else{
            return (this.renderMyAchieve())
        }
    }


    onItemPress(rowData){

    }

    renderAchieveItem(rowData, sectionID, rowID){
        let cover = rowData.cover;
        let coverpath = null;
        if(rowData.coveraid == 0){
            coverpath = `${httpsBaseUrl}${cover}`;
        }else{
            coverpath = `${PicBaseUrl}${cover}`;
        }

        return (
            <TouchableOpacity onPress={() => this.onItemPress(rowData)}>
                <View style={styles.listItem}>

                </View>
            </TouchableOpacity>
        )
    }

    renderMyAchieve(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_myAchieve()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.achieve_data_source)}
                renderRow={this._renderAchieveItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderMyAchieveView()}
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

AchievementList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number,//1 克隆
    qstid:PropTypes.number,
    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,
    gorefresh: PropTypes.number,
};


module.exports = AchievementList;