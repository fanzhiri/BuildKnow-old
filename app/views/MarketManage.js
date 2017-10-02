/**
 * Created by slako on 17/10/02.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl,TextInput,SegmentedControlIOS} from "react-native";
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

var doGetMyBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doCloneQstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=cloneqst";

const MAX_TEMPLATE = 13 ;
const MAX_SUBITEM = 12 ;

class MarketManage extends Component {



    constructor(props) {

        super(props);
        let t_Store_Mode_List=new Array();
        this.state = {
            store_data_source: t_Store_Mode_List,
            gorefreshing:false,
        };

        this._renderStoreItem = this.renderStoreItem.bind(this);
        this._onStoreItemTypeChange = this.onStoreItemTypeChange.bind(this);
        this._renderSubItemListView = this.renderSubItemListView.bind(this);
    }

    addSubItem(rowData, rowID){
        let remainadd = MAX_SUBITEM-rowData.sub_item.length;
        let t_store_data_source=this.state.store_data_source;
        let t_sub_data_source =t_store_data_source[rowID].sub_item;
        let sub_item_one={
            idx:0,
            name:"",
            img:null,
            url:null,
            sortnum:MAX_SUBITEM-remainadd+1,
        };

        t_sub_data_source.push(sub_item_one);
        this.setState({
            store_data_source:t_store_data_source
        })
    }

    addStoreItem(){
        let remainadd = MAX_TEMPLATE-this.state.store_data_source.length;
        let t_store_data_source=this.state.store_data_source;

        let sub_item_list = new Array();
        let store_item_one ={
            idx:0,
            type:0,
            name:"",
            sortnum:MAX_TEMPLATE-remainadd+1,
            sub_item:sub_item_list

        };
        t_store_data_source.push(store_item_one);
        this.setState({
            store_data_source:t_store_data_source
        })
    }

    onStoreItemTypeChange(event, rowData, rowID){
        let t_store_data_source=this.state.store_data_source;
        t_store_data_source[rowID].type = event.nativeEvent.selectedSegmentIndex;
        this.setState({
            store_data_source:t_store_data_source
        })
    }

    renderSubItemListView(rowData){
        if(rowData.sub_item.length == 0){
            return;
        }
        return(
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(rowData.sub_item)}
                renderRow={this._renderStoreItem}
                enableEmptySections = {true}
            />
        )
    }

    sortNumChange(rowID,text){

    }
    nameChange(rowID,text){

    }

    renderStoreItem(rowData, sectionID, rowID) {

        let remainadd =14;
        return(
            <View>
                <TextInput
                    style={{height:24,width:32,fontSize:14,borderColor:"#0000FF",borderWidth: 2,padding:2,marginLeft:6}}
                    onChangeText={(text) => this.sortNumChange(rowID,text)}
                    value={this.state.store_data_source[rowID].sortnum.toString()}
                    placeholder={""}
                    maxLength={2}
                    multiline={false}
                />
                <View>
                    <SegmentedControlIOS
                        values={["轮播","横列表","缩点"]}
                        selectedIndex={rowData.type}
                        style={{width:180}}
                        onChange={(event)=>this._onStoreItemTypeChange(event,rowData, rowID)}
                    />
                </View>

                <TextInput
                    style={{height:24,width:100,fontSize:14,borderColor:"#0000FF",borderWidth: 2,padding:2,marginLeft:10}}
                    onChangeText={(text) => this.nameChange(rowID,text)}
                    value={this.state.store_data_source[rowID].name}
                    placeholder={"填写"}
                    maxLength={20}
                    multiline={false}
                />

                {this.renderSubItemListView(rowData)}
                <TouchableOpacity onPress={() => this.addSubItem(rowData, rowID)}>
                    <View style={{justifyContent:"center",alignItems:"center",height:32,borderRadius:8,backgroundColor:"#00F0F0"}}>
                        <Text>添加子项,还可以添加{remainadd}个</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderStoreListView(){
        if(this.state.store_data_source.length == 0){
            return;
        }
        return(
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.store_data_source)}
                renderRow={this._renderStoreItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){

        let remainadd = MAX_TEMPLATE-this.state.store_data_source.length;

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderStoreListView()}
                <TouchableOpacity onPress={() => this.addStoreItem()}>
                    <View style={{justifyContent:"center",alignItems:"center",height:32,borderRadius:8,backgroundColor:"#00F0F0"}}>
                        <Text>添加模块,还可以添加{remainadd}个</Text>
                    </View>
                </TouchableOpacity>
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

MarketManage.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number,//1 克隆
    qstid:PropTypes.number,
    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,
};


module.exports = MarketManage;