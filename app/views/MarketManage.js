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
import Swiper from 'react-native-swiper';

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
    imgCarousel:{
        width:380,
        height:200,
        resizeMode:'cover',
    },
});

var doGetMyBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doCloneQstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=cloneqst";
var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";

const MAX_TEMPLATE = 13 ;
const MAX_SUBITEM = 12 ;

class MarketManage extends Component {



    constructor(props) {

        super(props);
        let t_Store_Mode_List = new Array();
        this.state = {
            store_data_source: t_Store_Mode_List,
            gorefreshing:false,
            module_idx:0,//给跳转页面返回值用
            module_sub_idx:0,//给跳转页面返回值用
            preview:false
        };

        this._renderStoreItem       = this.renderStoreItem.bind(this);
        this._renderSubItem         = this.renderSubItem.bind(this);
        this._onStoreItemTypeChange = this.onStoreItemTypeChange.bind(this);
        this._renderSubItemListView = this.renderSubItemListView.bind(this);
        this._renderPreview         = this.renderPreview.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.bookdata == null){
            return;
        }
        let t_store_data_source=this.state.store_data_source;

        t_store_data_source[this.state.module_idx].sub_item[this.state.module_sub_idx].name = nextProps.bookdata.bookname;
        t_store_data_source[this.state.module_idx].sub_item[this.state.module_sub_idx].bookid = nextProps.bookdata.reviewid;
        t_store_data_source[this.state.module_idx].sub_item[this.state.module_sub_idx].cover = nextProps.bookdata.cover;
        t_store_data_source[this.state.module_idx].sub_item[this.state.module_sub_idx].poster = nextProps.bookdata.poster;
        //alert(nextProps.bookdata.cover+"]["+nextProps.bookdata.poster)
        this.setState({
            store_data_source:t_store_data_source
        })
    }

    addSubItem(rowData, rowID){
        let remainadd = MAX_SUBITEM-rowData.sub_item.length;
        let t_store_data_source=this.state.store_data_source;
        let t_sub_data_source =t_store_data_source[rowID].sub_item;
        let sub_item_one={
            idx:rowData.idx,
            bookid:0,
            name:"点击添加",
            cover:null,
            poster:null,
            url:null,
            sortnum:MAX_SUBITEM-remainadd+1,
        };

        t_sub_data_source.push(sub_item_one);
        this.setState({
            store_data_source:t_store_data_source
        })
    }

    //增加大模块
    addStoreItem(){
        let remainadd = MAX_TEMPLATE-this.state.store_data_source.length;
        let t_store_data_source=this.state.store_data_source;

        let sub_item_list = new Array();
        let store_item_one ={
            idx:this.state.store_data_source.length,
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




    renderSubItemListView(rowData, rowiD){

        if(rowData.sub_item.length == 0){
            return;
        }
        let idx =rowiD;
        return(
            <ListView
                style={{marginLeft:12}}
                dataSource={DataStore.cloneWithRows(rowData.sub_item)}
                renderRow={(rowData, sectionID,rowID)=>this.renderSubItem(rowData,sectionID, rowID, idx)}
                enableEmptySections = {true}
            />
        )
    }

    sortNumChange(rowID,text){

    }
    nameChange(rowID,text){

    }

    addSubItemButton(rowData, rowID,storeidx){
        if(rowData.bookid != 0){
            Actions.bookcover({bookpublicid:rowData.bookid})
            return;
        }
        this.setState({
            module_idx:storeidx,
            module_sub_idx:rowID
        });
        //alert(rowData.idx+"]:["+rowID);
        Actions.mycollectlist({intype:1,processprop:1,inmode:1});
    }

    modify_subitem(){

    }

    del_subitem(){

    }

    renderAddDellBtn(rowData){
        if(rowData.name == "点击添加"){
            return;
        }
        return(
            <View style={{flexDirection:"row",height:24,width:100,alignItems:"center"}}>
                <TouchableOpacity style={{flex:1}} onPress={() => this.modify_subitem()}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>修改</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => this.del_subitem()}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>删除</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderSubItem(rowData,sectionID,rowID,idx) {
        return(
            <View style={{flexDirection:"row",height:24,alignItems:"center",margin:2}}>
                <TouchableOpacity style={{flex:1}} onPress={() => this.addSubItemButton(rowData, rowID,idx)}>
                    <View style={{borderColor:"#0000FF",borderWidth: 1,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6"}}>
                        <Text>{idx}:{rowID}</Text>
                        <Text style={{marginLeft:6}}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>
                {this.renderAddDellBtn(rowData)}
            </View>

        )
    }

    deleteStoreItem(rowData, rowID){
        let t_store_data_source=this.state.store_data_source;
        t_store_data_source.splice(rowID,1);

        this.setState({
            store_data_source:t_store_data_source
        })
    }

    renderStoreItem(rowData, sectionID, rowID) {

        let remainadd = MAX_SUBITEM - rowData.sub_item.length;
        if (this.state.preview == true) {
            return(this.renderPreview(rowData, sectionID, rowID));
        } else {
            return (
                <View style={{margin:4,padding:2,borderWidth:1,borderColor:"#000000",backgroundColor:"#EEEE00"}}>
                    <View style={{alignItems:"center",height:24,marginBottom:4,flexDirection:"row",}}>
                        <Text style={{flexDirection:"row",justifyContent:"center",alignItems:"center",fontSize:16,flex:1}}>
                            模块 {parseInt(rowID) + 1}
                        </Text>
                        <TouchableOpacity onPress={() => this.deleteStoreItem(rowData, rowID)}>
                            <View
                                style={{justifyContent:"center",alignItems:"center",width:36,height:22,borderRadius:4,backgroundColor:"#CD69C9"}}>
                                <Text>删除</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",marginBottom:4}}>
                        <TextInput
                            style={{height:24,width:32,fontSize:14,borderColor:"#0000FF",borderWidth: 1,padding:2,marginLeft:6,backgroundColor:"#FFFFFF"}}
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
                                style={{height:24,width:150,marginLeft:10}}
                                onChange={(event)=>this._onStoreItemTypeChange(event,rowData, rowID)}
                            />
                        </View>

                        <TextInput
                            style={{height:24,width:100,fontSize:14,borderColor:"#0000FF",borderWidth: 1,padding:2,marginLeft:10,backgroundColor:"#FFFFFF"}}
                            onChangeText={(text) => this.nameChange(rowID,text)}
                            value={this.state.store_data_source[rowID].name}
                            placeholder={"名称填写"}
                            maxLength={20}
                            multiline={false}
                        />
                    </View>

                    {this._renderSubItemListView(rowData, rowID)}
                    <TouchableOpacity onPress={() => this.addSubItem(rowData, rowID)}>
                        <View
                            style={{justifyContent:"center",alignItems:"center",margin:4,height:32,borderRadius:8,backgroundColor:"#CD69C9"}}>
                            <Text>添加子项,还可以添加{remainadd}个</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
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

    preview(yes){

        this.setState({
            preview:yes
        })
    }

    finishEdit(){

    }

    renderImage(store_data_item){
        let imageViews=[];
        for(let i=0;i< store_data_item.sub_item.length;i++){
            imageViews.push(
                <Image
                    key={i}
                    style={styles.imgCarousel}
                    source={{uri:`${httpsPicBaseUrl}${store_data_item.sub_item[i].poster}`}}
                />
            );
        }
        return imageViews;
    }

    renderPreview(rowData, sectionID, rowID){

        switch (this.state.store_data_source[rowID].type){
            case 0 :
                return(
                    <View>
                        <Swiper height={200} loop={true} autoplay={true}>
                            {this.renderImage(this.state.store_data_source[rowID])}
                        </Swiper>
                    </View>
                )
                break;
            case 1 :

                break;
            case 2 :break;
        }


    }

    renderBottomButtom(){
        let remainadd = MAX_TEMPLATE-this.state.store_data_source.length;
        if(this.state.preview) {
            return (
                <View style={{margin:2,height:36,flexDirection:"row"}}>

                    <TouchableOpacity style={{flex:1}} onPress={() => this.preview(false)}>
                        <View
                            style={{justifyContent:"center",alignItems:"center",margin:2,height:32,borderRadius:8,backgroundColor:"#8B7500"}}>
                            <Text>取消预览</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )
        }else{
            return(
                <View style={{margin:2,height:36,flexDirection:"row"}}>
                    <TouchableOpacity style={{flex:4}} onPress={() => this.addStoreItem()}>
                        <View style={{justifyContent:"center",alignItems:"center",margin:2,height:32,borderRadius:8,backgroundColor:"#00F0F0"}}>
                            <Text>添加模块,还可以添加{remainadd}个</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1}} onPress={() => this.preview(true)}>
                        <View style={{justifyContent:"center",alignItems:"center",margin:2,height:32,borderRadius:8,backgroundColor:"#8B7500"}}>
                            <Text>预览</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1}} onPress={() => this.finishEdit()}>
                        <View style={{justifyContent:"center",alignItems:"center",margin:2,height:32,borderRadius:8,backgroundColor:"#7FFF00"}}>
                            <Text>完成</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

    }


    render(){



        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderStoreListView()}
                {this.renderBottomButtom()}
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

    bookdata:PropTypes.object
};


module.exports = MarketManage;