/**
 * Created by slako on 17/10/02.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl,TextInput,SegmentedControlIOS,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';
import Swiper from 'react-native-swiper';
import MarketListItem from '../component/MarketListItem';

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
    },title:{
        marginTop:16,
        marginBottom:8,
        marginLeft:8,
        color: 'red',
        fontSize: 24,
    }
});

var doUpdateMarketUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=updatemarket";

var doGetMarketUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=getmarket";
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
        this._renderPrevHoriRow     = this.renderPrevHoriRow.bind(this);
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

    fetchUpdateMarket(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("adminid",global.adminid);
        formData.append("market",JSON.stringify(this.state.store_data_source));
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doUpdateMarketUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Alert.alert('提示','上传成功',[
                        {text:'好的'}
                    ]);
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetchtoday(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("adminid",global.adminid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMarketUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        store_data_source:JSON.parse(responseData.data)
                    })
                    Alert.alert('提示','下载成功',[
                        {text:'好的'}
                    ]);
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
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
            type:0,//0广告轮播 1横列表 2多点
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
        let t_store_data_source=this.state.store_data_source;
        t_store_data_source[rowID].sortnum = parseInt(text);
        this.setState({
            store_data_source:t_store_data_source
        });

    }
    nameChange(rowID,text){
        let t_store_data_source=this.state.store_data_source;
        t_store_data_source[rowID].name = text;
        this.setState({
            store_data_source:t_store_data_source
        });

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

    change_subitem(rowData, rowID,storeidx){

        this.setState({
            module_idx:storeidx,
            module_sub_idx:rowID
        });
        //alert(rowData.idx+"]:["+rowID);
        Actions.mycollectlist({intype:1,processprop:1,inmode:1});
    }

    del_subitem(rowID,idx){
        //alert(rowID+"]["+idx);
        let t_store_data_source=this.state.store_data_source;
        //alert(t_store_data_source[rowID].sub_item.length+"]["+rowID+"]["+idx);
        t_store_data_source[idx].sub_item.splice(rowID,1);

        this.setState({
            store_data_source:t_store_data_source
        })
    }

    renderAddDellBtn(rowData, rowID,idx){
        if(rowData.name == "点击添加"){
            return;
        }
        return(
            <View style={{flexDirection:"row",height:24,width:100,alignItems:"center"}}>
                <TouchableOpacity style={{flex:1}} onPress={() => this.change_subitem(rowData, rowID,idx)}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>修改</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => this.del_subitem(rowID,idx)}>
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
                {this.renderAddDellBtn(rowData, rowID,idx)}
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

    renderTitleEdit(rowID){
        if(this.state.store_data_source[rowID].type != 1){
            return;
        }
        return(
            <TextInput
                style={{height:24,width:100,fontSize:14,borderColor:"#0000FF",borderWidth: 1,padding:2,marginLeft:10,backgroundColor:"#FFFFFF"}}
                onChangeText={(text) => this.nameChange(rowID,text)}
                value={this.state.store_data_source[rowID].name}
                placeholder={"名称填写"}
                maxLength={20}
                multiline={false}
            />
        )
    }

    renderStoreItem(rowData, sectionID, rowID) {

        let remainadd = MAX_SUBITEM - rowData.sub_item.length;
        if (this.state.preview == true) {
            return(this.renderPreview(rowData, sectionID, rowID));
        } else {
            return (
                <View style={{margin:4,padding:6,borderWidth:1,borderColor:"#000000",backgroundColor:"#EEEE00"}}>
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

                        {this.renderTitleEdit(rowID)}
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

    checkRight(){
        let t_store_data_source=this.state.store_data_source;
        let swipernum =0;
        for(let i=0;i< t_store_data_source.length;i++){
            if(t_store_data_source[i].type == 0){
                if(swipernum == 1){
                    return false;
                }
                swipernum++;
            }else if(t_store_data_source[i].type == 1){
                if(t_store_data_source[i].name == ''){
                    return false;
                }
            }
        }
        return true;
    }

    preview(yes){
        if(this.checkRight() == false){
            Alert.alert('提示','不符合规范',[
                {text:'好的'}
            ]);
            return;
        }

        this.setState({
            preview:yes
        })
    }

    finishEdit(){
        this.fetchUpdateMarket();
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

    renderPrevHoriRow(rowData, sectionID, rowID){
        return(
            <View>
                <MarketListItem
                    rowID={rowID}  cover={rowData.cover} bookname={rowData.name} book={rowData}/>
            </View>
        )
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
                return(
                    <View>
                        <Text style={styles.title} >{this.state.store_data_source[rowID].name}</Text>
                        <ListView
                            enableEmptySections={true}
                            horizontal={true}
                            dataSource={DataStore.cloneWithRows(this.state.store_data_source[rowID].sub_item)}
                            showsHorizontalScrollIndicator={false}
                            renderRow={this._renderPrevHoriRow} />
                    </View>
                )
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
                    <TouchableOpacity style={{flex:1}} onPress={() => this.fetchtoday()}>
                        <View style={{justifyContent:"center",alignItems:"center",margin:2,height:32,borderRadius:8,backgroundColor:"#0BFF50"}}>
                            <Text>获取</Text>
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