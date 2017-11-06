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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

var doSetChapterUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=setchapter";

var httpsBaseUrl = "https://slako.applinzi.com/";

const MAX_CHAPTER =32 ;

class EditChapter extends Component {


    constructor(props) {

        super(props);
        let chaterlen = 0;
        if(props.chapter_arr != null){
            chaterlen=props.chapter_arr.length;
        }

        let t_remainadd= MAX_CHAPTER - chaterlen;//最多20章节

        let t_chapterList=new Array();
        for(let i=0;i < chaterlen;i++){
            let chapteritemone ={
                name:props.chapter_arr[i].name,
                idx:props.chapter_arr[i].idx,
                sortnum:props.chapter_arr[i].sortnum,
                qstnum:props.chapter_arr[i].qstnum,
                num_error:0,
                name_error:0
            }
            t_chapterList[i]=chapteritemone;

        }


        let t_chapterListShadow = JSON.parse(JSON.stringify(t_chapterList));

        this.state = {
            chapter_arr: props.chapter_arr,
            gorefreshing:false,
            editing:false,
            inputtextstring:"",
            chapterList:t_chapterList,
            chapterListShadow:t_chapterListShadow,
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

    dofetch_setChapter(t_chapterListShadow){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);
        formData.append("chapter",JSON.stringify(t_chapterListShadow));
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doSetChapterUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        chapterList:t_chapterListShadow,
                        editing:false
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
    dellChapterItem(rowID){
        let t_chapterListShadow=this.state.chapterListShadow;
        t_chapterListShadow.splice(rowID,1);

        let chapterlen = t_chapterListShadow.length;
        //检查排序是否有重复 begin
        let numover =false;
        for(let i=0;i<chapterlen;i++){
            if(parseInt(t_chapterListShadow[i].sortnum)>chapterlen){
                t_chapterListShadow[i].num_error = 2;
                numover =true;
            }
        }

        if(numover == false){
            for(let i=0;i<chapterlen;i++){
                for(let j=0;j<chapterlen;j++){
                    if(i == j)continue;
                    if(parseInt(t_chapterListShadow[i].sortnum) == parseInt(t_chapterListShadow[j].sortnum)){
                        t_chapterListShadow[i].num_error = 2;
                        t_chapterListShadow[j].num_error = 2;
                        break;
                    }
                    if(j ==(chapterlen-1)){
                        t_chapterListShadow[i].num_error = 0;
                    }
                    if(i==(chapterlen-1) && (j==i-1)){
                        t_chapterListShadow[i].num_error = 0;
                    }
                }
            }
        }
        //检查排序是否有重复 end
        //检查名字是否有重复 begin
        for(let i=0;i<chapterlen;i++){
            for(let j=0;j<chapterlen;j++){
                if(i == j)continue;
                if(t_chapterListShadow[i].name == t_chapterListShadow[j].name){
                    t_chapterListShadow[i].name_error = 1;
                    t_chapterListShadow[j].name_error = 1;
                    break;
                }
                if(j ==(chapterlen-1)){
                    t_chapterListShadow[i].name_error = 0;
                }
                if(i==(chapterlen-1) && (j==i-1)){
                    t_chapterListShadow[i].name_error = 0;
                }
            }
        }
        //检查名字是否有重复 end
        this.setState({
            chapterListShadow:t_chapterListShadow
        })
    }

    sortNumChange(rowID,text){
        let t_chapterListShadow = this.state.chapterListShadow;
        t_chapterListShadow[rowID].sortnum = text;

        let t_sortnum = parseInt(text);
        if(t_sortnum < 1 || t_sortnum > t_chapterListShadow.length){
            t_chapterListShadow[rowID].num_error =1;
        }else{
            t_chapterListShadow[rowID].num_error =0;
        }

        let chapterlen = t_chapterListShadow.length;
        if(t_chapterListShadow[rowID].num_error == 0 ){
            for(let i=0;i<chapterlen;i++){
                for(let j=0;j<chapterlen;j++){
                    if(i == j)continue;
                    if(parseInt(t_chapterListShadow[i].sortnum) == parseInt(t_chapterListShadow[j].sortnum)){
                        t_chapterListShadow[i].num_error = 2;
                        t_chapterListShadow[j].num_error = 2;
                        break;
                    }
                    if(j ==(chapterlen-1)){
                        t_chapterListShadow[i].num_error = 0;
                    }
                    if(i==(chapterlen-1) && (j==i-1)){
                        t_chapterListShadow[i].num_error = 0;
                    }
                }
            }
        }

        this.setState({
            chapterListShadow:t_chapterListShadow
        })
    }

    nameChange(rowID,text){
        let t_chapterListShadow = this.state.chapterListShadow;
        t_chapterListShadow[rowID].name = text;

        let chapterlen = t_chapterListShadow.length;

        for(let i=0;i<chapterlen;i++){
            if(t_chapterListShadow[i].name ==''){
                t_chapterListShadow[i].name_error = 1;
                break;
            }
            for(let j=0;j<chapterlen;j++){
                if(i == j)continue;
                if(t_chapterListShadow[i].name == t_chapterListShadow[j].name){
                    t_chapterListShadow[i].name_error = 1;
                    t_chapterListShadow[j].name_error = 1;
                    break;
                }
                if(j ==(chapterlen-1)){
                    t_chapterListShadow[i].name_error = 0;
                }
                if(i==(chapterlen-1) && (j==i-1)){
                    t_chapterListShadow[i].name_error = 0;
                }
            }
        }


        this.setState({
            chapterListShadow:t_chapterListShadow
        })
    }

    renderAddChapterItem(rowData, sectionID, rowID){
        if(this.state.chapterListShadow.length == 0){
            return null;
        }

        let formcolor = "#04c4c4"
        if(this.state.chapterListShadow[rowID].num_error == 1){
            formcolor = "#FF0000"
        }else if(this.state.chapterListShadow[rowID].num_error == 2){
            formcolor = "#0000FF"
        }
        let formNamecolor = "#04c4c4"
        if(this.state.chapterListShadow[rowID].name_error == 1){
            formNamecolor = "#0000FF"
        }
        return(
            <View style={styles.listItem}>
                <TextInput
                    style={{width:32,fontSize:14,borderColor:formcolor,borderWidth: 2,padding:2,marginLeft:6}}
                    onChangeText={(text) => this.sortNumChange(rowID,text)}
                    value={this.state.chapterListShadow[rowID].sortnum.toString()}
                    placeholder={""}
                    maxLength={2}
                    multiline={false}
                />
                <TextInput
                    style={{width:100,fontSize:14,borderColor: formNamecolor,borderWidth: 2,padding:2,marginLeft:10}}
                    onChangeText={(text) => this.nameChange(rowID,text)}
                    value={this.state.chapterListShadow[rowID].name}
                    placeholder={"填写"}
                    maxLength={20}
                    multiline={false}
                />
                <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                    <TouchableOpacity onPress={() => this.dellChapterItem(rowID)}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#FF0F00",borderRadius:6}}>
                            <Text >删除</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderChapterItem(rowData, sectionID, rowID) {
        if(this.state.editing){
            return this.renderAddChapterItem(rowData, sectionID, rowID);
        }else {
            return this.renderChapterNormalItem(rowData, sectionID, rowID);
        }
    }
    renderChapterNormalItem(rowData, sectionID, rowID){

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
        let t_chapterList = JSON.parse(JSON.stringify(this.state.chapterList));
        this.setState({
            chapterListShadow:t_chapterList,
            editing:true
        })

    }

    saveChapter(){

        let t_chapterListShadow = JSON.parse(JSON.stringify(this.state.chapterListShadow));
        let chapterlen = t_chapterListShadow.length;

        for(let i=0;i<chapterlen;i++){
            if(t_chapterListShadow[i].name_error != 0){
                return;
            }else if(t_chapterListShadow[i].num_error != 0){
                return;
            }
        }
        t_chapterListShadow.sort(function (a,b) {
            let aNum =parseInt(a.sortnum);
            let bNum =parseInt(b.sortnum);
            return aNum >= bNum?1:-1;
        });
        this.dofetch_setChapter(t_chapterListShadow);

    }

    cancelAdd(){
        this.setState({
            editing:false
        })
    }



    addChapterItem(){
        let remainadd = MAX_CHAPTER-this.state.chapterListShadow.length;
        let t_chapterListShadow=this.state.chapterListShadow;
        let chapteritemone ={
            name:"",
            idx:0,
            sortnum:MAX_CHAPTER-remainadd+1,
            qstnum:0,
            num_error:0,
            name_error:1
        }
        t_chapterListShadow.push(chapteritemone);
        this.setState({
            chapterListShadow:t_chapterListShadow
        })
    }

    renderAddChapterButton(){
        if(this.state.chapterList.length >= 32){
            return;
        }else{
            let remainadd = MAX_CHAPTER-this.state.chapterListShadow.length;
            return(
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.addChapterItem()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >添加</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginLeft:12}}>还可以添加{remainadd}个章节</Text>
                </View>
            )
        }
    }

    renderAddView(){
        if(this.state.editing == false){
            let remainadd = MAX_CHAPTER-this.state.chapterList.length;
            return(
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.beginAdd()}>
                        <View style={{width:48,height:28,marginLeft:8,alignItems:"center",justifyContent:"center",backgroundColor:"#00FF00",borderRadius:6}}>
                            <Text >编辑</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginLeft:12}}>还可以添加{remainadd}个章节</Text>
                </View>
            )
        }else{
            return(
            <View>
                {this.renderAddChapterButton()}
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => this.saveChapter()}>
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
        let nowChapterList = this.state.editing?this.state.chapterListShadow:this.state.chapterList;

        return (
            <KeyboardAwareScrollView
                extraScrollHeight={10}>
                <ListView
                    ref="scrview"
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(nowChapterList)}
                    renderRow={this._renderChapterItem}
                    enableEmptySections = {true}
                />
                {this.renderAddView()}
            </KeyboardAwareScrollView>
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