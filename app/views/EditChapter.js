/**
 * Created by slako on 17/9/27.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl,ScrollView,TextInput} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';

import Icon from 'react-native-vector-icons/Ionicons';
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
    },chatinput:{
        flex:1,
        fontSize:16,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        marginRight:6,
        borderRadius:4
    },
});

var doGetMyBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

class EditChapter extends Component {

    constructor(props) {

        super(props);
        let chaterlen = 0;
        if(props.chapter_arr != null){
            chaterlen=props.chapter_arr.length;
        }

        let t_remainadd= 20 - chaterlen;//最多20章节

        let t_chapterList=new Array();
        for(let i=0;i < chaterlen;i++){
            let chapteritemone ={
                name:props.chapter_arr[i].name,
                idx:props.chapter_arr[i].idx,
                sortnum:props.chapter_arr[i].sortnum,
                qstnum:props.chapter_arr[i].qstnum,
            }
            t_chapterList[i]=chapteritemone;
        }

        this.state = {
            chapter_arr: props.chapter_arr,
            gorefreshing:false,
            editing:false,
            inputtextstring:"",
            remainadd:t_remainadd,
            chapterList:t_chapterList
        };

        this._renderChapterItem = this.renderChapterItem.bind(this)
    }

    dofetch_mybooks(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyBooksUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        books_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderMyBooksView(){
        if(this.state.books_data_source ==null){
            this.dofetch_mybooks();
            return (this.renderLoading())
        }else{
            return (this.renderMyBooks())
        }
    }

    onListItemClick(rowData, sectionID, rowID){

    }
    dellChapterItem(){

    }

    renderAddChapterItem(rowData, sectionID, rowID){
        return(
            <View>
                <TextInput
                    style={{width:48,fontSize:16}}
                    onChangeText={(text) => this.setState({inputtextstring:text})}
                    value={this.state.chapterList[rowID].sortnum}
                    placeholder={""}
                    maxLength={2}
                    multiline={false}
                />
                <TextInput
                    style={{width:180,fontSize:16}}
                    onChangeText={(text) => this.setState({inputtextstring:text})}
                    value={this.state.chapterList[rowID].name}
                    placeholder={""}
                    maxLength={20}
                    multiline={false}
                />
                <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                    <TouchableOpacity onPress={() => this.dellChapterItem()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >删除</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderChapterItem(rowData, sectionID, rowID){

        return (
            <TouchableOpacity onPress={() => this.onListItemClick(rowData, sectionID, rowID)}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <View>
                        <Text>{rowData.name}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    beginAdd(){
        this.setState({
            editing:true
        })
    }

    addChapter(){

    }

    cancelAdd(){
        this.setState({
            editing:false
        })
    }



    addChapterItem(){
        let t_chapterList=this.state.chapterList;
        let chapteritemone ={
            name:"填写",
            idx:0,
            sortnum:20-this.state.remainadd+1,
            qstnum:0,
        }
        t_chapterList.push(chapteritemone);
        this.setState({
            chapterList:t_chapterList
        })
    }

    renderAddView(){
        if(this.state.editing == false){
            return(
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.beginAdd()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >编辑</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginLeft:12}}>还可以添加{this.state.remainadd}个章节</Text>
                </View>
            )
        }else{
            return(
            <View>
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.addChapterItem()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >添加</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginLeft:12}}>还可以添加{this.state.remainadd}个章节</Text>
                </View>
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.addChapter()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >保存</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.cancelAdd()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#FF0F00",borderRadius:6}}>
                            <Text >取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            )
        }

    }

    renderChapterView(){
        return (
            <ScrollView
                style={styles.scrlist}>
                <ListView
                    ref="scrview"
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.chapterList)}
                    renderRow={this._renderChapterItem}
                    enableEmptySections = {true}
                />
                {this.renderAddView()}
            </ScrollView>
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderChapterView()}
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

EditChapter.PropTypes = {
    bookid:PropTypes.number,
    chapter_arr:PropTypes.object,

};

module.exports = EditChapter;