/**
 * Created by slako on 17/3/28.
 * 组建题本
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet, SegmentedControlIOS, ListView, TouchableOpacity,Alert,ScrollView,RefreshControl} from "react-native";

import Button from 'apsl-react-native-button'
import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import BookIntroduce from './BookIntroduce'
import BookDiscuss from './BookDiscuss'
import BookHistory from './BookHistory'
import DataStore from '../util/DataStore';
import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem'

import Dialog from "react-native-dialog";

import Toast, {DURATION} from 'react-native-easy-toast'



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        marginTop:10,
        marginLeft:10,
        flexDirection:'row',
        height:80,
    },
    container2: {
        flex: 3,
    },
    segmentedcontrolcontainer: {
        marginBottom:10,
    },
    fullscreen: {
        justifyContent: 'flex-end',
        flex:1,
    },
    image:{
        flex:1,
        width:80,

        borderRadius:16,
    },
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    },
    list:{
        marginTop:6
    },
    questionitemcontainer:{

        padding:5,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#ab82ff',
    },
    questionitem:{
        marginTop:8,
        marginLeft:8,
        fontSize: 16,
    },
    questioneditcontainer:{
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection:'row',
        borderTopWidth:0.5,
        borderLeftWidth:0.5,
        borderRightWidth:0.5,
        borderBottomWidth:0.5,
        borderBottomColor:'#9acd32',
        marginTop:8,
        marginBottom:8,
        padding:4,
    },
    questionedittext:{
        fontSize: 14,
        borderLeftWidth:0.5,
        borderRightWidth:0.5,
        borderBottomColor:'#9acd32',
        color:'#CD2626'
    },
    sharecontrolcontainer:{
        height:32,
        borderTopColor:'#9acd32',
        borderBottomColor:'#9acd32',
        borderTopWidth:0.5,
        borderBottomWidth:0.5,
        flexDirection:'row',
        alignItems:'center',
        marginLeft:10,
    },
    sharecontrolcontainer2:{
        flex: 1,
        height:32,
        justifyContent: 'flex-end',
        alignItems:'center',
        flexDirection:'row',
        marginRight:10,
    },
    sharecontroltext:{
        fontSize: 14,
    },
    imgcontainer:{
        justifyContent: 'space-around',
        flexDirection:'row',
    },
    leftImgStyle:{
        width:100,
        height:100,
        marginTop:16,
    },
    rightImgStyle:{
        width:190,
        height:100,
        marginTop:16,
    },
    infoedittext:{
        marginTop:10,
        fontSize: 16,
    },
    infocontainer:{
        marginLeft:10,
        marginRight:10,

    },
    edittext:{
        marginTop:12,
        fontSize: 16,
        color:'#CD2626'
    },
    btncontainer:{
        height: 48,
        marginTop:10,
        justifyContent: 'space-around',
        flexDirection:'row',
    },
    addQuestionButton:{
        width:60,height:24,
        backgroundColor: '#00FF7F',
    },
    listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    btnFlexEndContainer:{

        justifyContent: 'flex-end',
    },
});

var doGetMyBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybookquestion";

var doDeleteQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=deletequestion";

var doGetMyComposeBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmycomposebook";

var doGetRecommendQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getrecommendquestion";

var doAcceptRecommendQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=acceptrecommendquestion";

var httpsBaseUrl = "https://slako.applinzi.com/";

var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";

class ComposeBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            composebookdata:null,
            bookquestion_data_source:null,
            selectedIndex:0,
            selectedQuestion:-1,
            get_questiondata:null,
            idea_recommend_data_source:null,
            gorefreshing:false,
            get_recommenddata:null,
            chapterSelect:0
        };
        this._onChange = this._onChange.bind(this);
        this._handlePress = this._handlePress.bind(this);
        this._renderQuestionItem = this.renderQuestionItem.bind(this);
        this._renderChapterBarRow = this.renderChapterBarRow.bind(this);
    }

    do_operate_recommendquestion(what,qid){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("questionid",qid);
        formData.append("userid",global.userid);
        formData.append("what",what);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doAcceptRecommendQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        composebookdata:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_mycomposebook(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookid);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyComposeBookUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        composebookdata:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_ideaquestion(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookid);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetRecommendQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        idea_recommend_data_source:responseData.data,
                        get_recommenddata:1
                    })
                }else{
                    this.setState({
                        get_recommenddata:2
                    })

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_mybookquestion(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookid);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyBookQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        bookquestion_data_source:responseData.data,
                        get_questiondata:1
                    })
                }else{
                    this.setState({
                        get_questiondata:2
                    })

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_deletequestion(id){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("questionid",id);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doDeleteQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100 ){
                    this.dofetch_mybookquestion();
                }else if(responseData.code == 101){
                    alert("正在审核中");
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    _handlePress(event) {

    }

    deletebook(){

    }

    render(){
        const {bookid} = this.props;
        global.composeBookid=bookid;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <View style={styles.segmentedcontrolcontainer}>
                    <SegmentedControlIOS
                        values={['简介','题目','分享','评论','建议']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                <View style={styles.fullscreen}>{this.renderSegmentedView()}</View>

                <Toast
                    ref="toastmsg"
                    style={{backgroundColor:'green'}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'red'}}
                />
            </View>
        );
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {
            return (
                this.renderBaseView()
                //this.renderQuestionView()
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderQuestionView()
            )
        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderDiscussView()
            )
        } else if (this.state.selectedIndex === 3) {
            return (
                this.renderHistoryView()
            )
        } else if (this.state.selectedIndex === 4) {
            return (
                this.renderRecommendView()
            )
        }
    }

    renderBaseView(){
        if(this.state.composebookdata == null){
            this.dofetch_mycomposebook();
            return (this.renderLoading())
        }else{
            return (this.renderBaseInfoView())
        }

    }

    renderQuestionView(){
        if(this.state.get_questiondata == null ){
            this.dofetch_mybookquestion();
            return (this.renderLoading());
        }else{
            if(this.state.bookquestion_data_source == null){
                return(this.rendernodata());
            }else{
                return(this.renderQuestionListView());
            }
        }

    }

    renderRecommendView(){
        if(this.state.get_recommenddata == null ){
            this.dofetch_ideaquestion();
            return (this.renderLoading());
        }else{
            if(this.state.idea_recommend_data_source == null){
                return(this.rendernodata())
            }else{
                return(this.renderIdeasView());
            }

        }

    }

    renderIdeasView(){
        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_ideaquestion()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.idea_recommend_data_source)}
                renderRow={this._renderQuestionItem}//这里的一定要加下划线杠，不然里面的this.state用不了
                enableEmptySections = {true}
            />
        )
    }

    selectquestion(index){
        this.setState({
            selectedQuestion:index
        });
    }

    deletequestion(id){
        this.dofetch_deletequestion(id);
    }

    checkquestion(index){
        Actions.newsomequestions({title:"题目查看",intype:1,qstlist:this.state.bookquestion_data_source,index:index})
    }

    acceptquestion(id){
        this.do_operate_recommendquestion(id);
    }

    renderEditRecommendView(qId) {
        if(this.state.selectedIndex === 4){
            return (
                <TouchableOpacity  onPress={()=> this.acceptquestion(qId)} >
                    <Text style={styles.questionedittext} >收录</Text>
                </TouchableOpacity>
            )
        }

    }

    renderEditView(index,qId){
        if(index == this.state.selectedQuestion){
            return (
                <View style={styles.questioneditcontainer}>

                    <TouchableOpacity style={{backgroundColor:"#00FFFF",borderRadius:4}} onPress={()=> this.checkquestion(index)} >
                        <Text style={styles.questionedittext} >查看</Text>
                    </TouchableOpacity>
                    <Text style={styles.questionedittext} >编辑</Text>
                    <TouchableOpacity  onPress={()=> this.deletequestion(qId)} >
                        <Text style={styles.questionedittext} >删除</Text>
                    </TouchableOpacity>
                    {this.renderEditRecommendView(qId)}
                </View>

            )
        }
    }

    renderQuestionItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        var qId = (rowData.questionid);
        return (
            <TouchableOpacity onPress={() => this.checkquestion(rowID)}>
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {parseInt(rowID)+1} : {ask.substring(0,20)}
                    </Text>
                    {this.renderEditView(rowID,qId)}
                </View>
            </TouchableOpacity>

        )
    }

    editbookinfo(){

    }
    editimginfo(){

    }

    editbookposter(){
        Actions.uploadpic({uploadtype:1,bookid:this.props.bookid});
    }

    renderClassSelect(){
        return(
            <TouchableOpacity
                onPress={() => Actions.classcatalogue({intype:1,deep:1,bookid:this.props.bookid})}
                activeOpacity={0.8}>
                <View style={[styles.listItem,style={marginTop:10}]}>

                    <Text style={{color: '#FF0000', fontSize: 16}}>类型选择：</Text>
                    <Text style={{color: "#FF0FF0", fontSize: 16}}>{this.state.composebookdata.classifyname}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color: "#ccc"}}>更改</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    renderBaseInfoView(){
        return (
            //注意!!!下面不能改为View，否则第一次查询不能显示
            <ScrollView style={styles.infocontainer}>
                <View style={styles.imgcontainer}>
                    <Image source={{uri:`${httpsBaseUrl}${this.state.composebookdata.cover}`}} style={styles.leftImgStyle}/>
                    <Image source={{uri:`${httpsPicBaseUrl}${this.state.composebookdata.poster}`}} style={styles.rightImgStyle}/>

                </View>
                <View style={styles.imgcontainer}>
                    <TouchableOpacity  onPress={()=> this.editbookinfo()} >
                        <Text style={styles.edittext} >(编辑 -> 图标)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=> this.editbookposter()} >
                        <Text style={styles.edittext} >(编辑 -> 推荐照片)  </Text>
                    </TouchableOpacity>

                </View>
                <View>

                    <Text style={styles.infoedittext}>名字：{this.state.composebookdata.bookname}</Text>
                    <Text style={styles.infoedittext}>简介：{this.state.composebookdata.bookbrief}</Text>
                    <Text style={styles.infoedittext}>描述：{this.state.composebookdata.bookdescription}</Text>
                    <TouchableOpacity  onPress={()=> this.editbookinfo()} >
                        <Text style={styles.edittext} >(编辑 -> 名字、简介、描述)</Text>
                    </TouchableOpacity>
                    <Text style={styles.infoedittext}>类型路径：{this.state.composebookdata.classifypath}</Text>
                </View>
                {this.renderClassSelect()}
            </ScrollView>
            //注意!!!上面不能改为View，否则第一次查询不能显示
        )
    }

    onChapterPressFunc(rowID){
        this.setState({
            chapterSelect: rowID,
        });
    }

    renderChapterBarRow(rowData, sectionID, rowID){
        let cateColor ;
        if(this.state.chapterSelect == rowID){
            cateColor="#FF0000";
        }else{
            cateColor="#000000";
        }
        return(
            <TouchableOpacity onPress={()=> this.onChapterPressFunc(rowID)} activeOpacity={0.8}>
                <Text style={{marginRight:6,marginLeft:6,color:cateColor}}>{rowData.name}</Text>
            </TouchableOpacity>
        )
    }

    renderAllChapter(){
        if(this.state.composebookdata.chapter == ""){
            return;
        }
        return(
            <ListView
                enableEmptySections={true}
                horizontal={true}
                dataSource={DataStore.cloneWithRows(JSON.parse(this.state.composebookdata.chapter))}
                renderRow={this._renderChapterBarRow} />
        )
    }

    editChapter(){
        let t_chapter_arr=null;
        if(this.state.composebookdata.chapter ==null ||this.state.composebookdata.chapter ==''){

        }else{
            t_chapter_arr=JSON.parse(this.state.composebookdata.chapter);
        }
        Actions.editchapter({bookid:this.props.bookid,chapter_arr:t_chapter_arr});
    }

    renderChapterBar(){

        return(
            <View  style={{height:32,backgroundColor:'#F0FF00',flexDirection:'row',alignItems: 'center',justifyContent:"flex-end"}}>
                {this.renderAllChapter()}
                <TouchableOpacity onPress={()=> this.editChapter()}>
                    <View style={{height:32,backgroundColor:"#FF0000",paddingLeft:6,paddingRight:6,justifyContent:"center",alignItems:"center"}}>
                        <Text>编辑章节</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }

    renderQuestionListView(){
        return (
            <View style={{flex:1}} >
                {this.renderChapterBar()}
                <ScrollView>
                    <ListView
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.bookquestion_data_source)}
                        renderRow={(rowData, sectionID, rowID) => this._renderQuestionItem(rowData, sectionID, rowID)}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.btnFlexEndContainer} >
                    <View style={{height:32}}>
                        <TouchableOpacity
                            style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#3086cc'}}
                            onPress={() => Actions.newsomequestions({intype:0,bookid:this.props.bookid})} >
                            <Text style={{fontSize:20}} >添题</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>


        )
    }



    docancelapply(){
        this.refs.toastmsg.show('真的吗!',DURATION.LENGTH_LONG)
    }

    cancelapplydialog(){
        //var bookid=this.props.bookid;
        //Actions.applyrelease({bookid});
        Alert.alert('撤销发布申请','确定撤销吗?',[
            {text:'是的',onPress:()=> this.docancelapply()},
            {text:'不了'}
        ]);
    }
/*
{text:'是的',onPress:()=> this.refs.toastmsg.show('hello world!',DURATION.LENGTH_LONG)},
{text:'不了',onPress:()=>this.refs.toastmsg.show('hello cancel!',DURATION.LENGTH_LONG)}
    */

    renderShareWayText(){
        var textway=null;
        if(this.state.composebookdata.share == 0){
            textway="私密";
        }else if(this.state.composebookdata.share == 1){
            textway="关注";
        }else if(this.state.composebookdata.share == 2){
            textway="所有";
        }else if(this.state.composebookdata.share == 3){
            textway="好友";
        }else if(this.state.composebookdata.share == 4){
            textway="指定";
        }
        return (
            <Text style={{color: "#FF0FF0", fontSize: 16}}>{textway}</Text>
        );
    }

    gocontrol(){

    }

    renderShareWay(){
        return(
            <TouchableOpacity onPress={() => Actions.sharecontrol({bookId:this.props.bookid,sharetype:this.state.composebookdata.share})} activeOpacity={0.8}>
                <View style={styles.listItem}>

                    <Text style={{color: '#FF0000', fontSize: 16}}>分享方式：</Text>
                    {this.renderShareWayText()}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color: "#ccc"}}>更改</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }



    renderDiscussView(){
        //const {bookid} = this.props;
        return (
            <ScrollView>
                {this.renderShareWay()}

                <TouchableOpacity
                    onPress={() => Actions.publishlist({bookid:this.props.bookid})}
                    activeOpacity={0.8}>
                    <View style={[styles.listItem,style={marginTop:10}]}>

                        <Text style={{color: '#FF0000', fontSize: 16}}>出版列表</Text>

                    </View>
                </TouchableOpacity>

            </ScrollView>

        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
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
            <View style={styles.btnFlexEndContainer} >

                <View style={{flexDirection:'row',height:38}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                        onPress={() => Actions.newsomequestions({intype:0,bookid:this.props.bookid})} >
                        <Text style={styles.addbuttontext} >添题</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

ComposeBook.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = ComposeBook;