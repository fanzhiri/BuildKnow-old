/**
 * Created by slako on 17/06/07.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';


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

var doGetMyReviewPlanUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmyreviewplan";
var httpsBaseUrl = "https://slako.applinzi.com/";

class ReviewPlan extends Component {

    constructor(props) {

        super(props);

        this.state = {
            reviewplan_data_source: null,
            getdata:0
        };

        this._renderPlanItem = this.renderPlanItem.bind(this)
    }

    dofetch_myReviewPlan(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyReviewPlanUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        reviewplan_data_source:responseData.data,
                        getdata:1
                    })
                }else{
                    this.setState({
                        getdata:1
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderMyBooksView(){
        if(this.state.getdata == 0){
            this.dofetch_myReviewPlan();
            return (this.renderLoading())
        }else{
            if(this.state.reviewplan_data_source == null){
                return(this.rendernodata())
            }else{
                return (this.renderMyPlans())
            }

        }
    }

    selectplantoglobal(rowData){
        Actions.pop();
    }

    renderSelect(rowData){
        if(this.props.intype == 1){
            return(
                <TouchableOpacity onPress={() => this.selectplantoglobal(rowData)}>
                        <Text>选中</Text>
                </TouchableOpacity>
            )
        }

    }


    renderPlanItem(rowData, sectionID, rowID){

        return (
            <TouchableOpacity onPress={() => Actions.newreviewplan({modetype:0,plandata:rowData})}>
                <View style={styles.listItem}>

                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>

                    <View>
                        <Text style={styles.topTitleStyle}>
                            名字：{rowData.name}
                        </Text>

                        <Text >
                            简介：{rowData.brief}
                        </Text>
                        <Text >
                            复习次数：{rowData.count}
                        </Text>
                        <Text >
                            持续时间：{rowData.alltime}
                        </Text>
                    </View>
                    <View style={{justifyContent: 'flex-end'}}>
                        {this.renderSelect(rowData)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderMyPlans(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.reviewplan_data_source)}
                renderRow={this._renderPlanItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {/*<Button onPress={() => Actions.newbook()}>添加题本</Button>*/}
                {this.renderMyBooksView()}
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

ReviewPlan.PropTypes = {
    intype:PropTypes.number,//0在设置中查看 1从添加熟悉计划
};

module.exports = ReviewPlan;