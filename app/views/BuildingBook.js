/**
 * Created by slako on 17/2/18.
 *
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet, SegmentedControlIOS,TouchableOpacity,ListView,RefreshControl} from "react-native";

import Button from "react-native-button";

import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import {Menu,MenuOptions,MenuOption,MenuTrigger,renderers} from 'react-native-popup-menu'

const {SlideInMenu}=renderers;

import BookIntroduce from './BookIntroduce'
import BookDiscuss from './BookDiscuss'
import BookHistory from './BookHistory'

import DataStore from '../util/DataStore';
import GlobleStyles from '../styles/GlobleStyles';
import Icon from 'react-native-vector-icons/Ionicons';

import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

var doGetBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbook";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doGetBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbookquestion";

var doGetRecommendQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getrecommendquestion";

var doGetDiscussUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getdiscuss";
var doCloneUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=clonebook";

var buildingbookcollectchangeUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=collectchange";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
        flexDirection:'row',
        height:160,
        flexDirection:'row',
    },
    container2: {
        flex: 2,
        marginLeft:10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    image:{
        flex:1,
        width:160,
        height:160,
        borderRadius:16,
    },
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    },
    button:{
        fontSize: 16,color: 'green' ,width:38,height:24, overflow:'hidden', borderRadius:4, backgroundColor: 'red'
    },
    textmargin:{
        marginTop:10,
    },
    arrButton:{
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:6,
        marginRight:8,
        width:60,height:32,
        backgroundColor: '#00FF7F',
    },
    ButtonViewContainer:{
        flex:1,
        justifyContent: 'flex-end',
    },
    bottomButtonViewContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        height: 32,
        alignItems: 'center',
    },
    bottomButtonText: {
        fontSize: 16,
    },
    addbuttontext:{
        fontSize:18,
    },
    list:{
        marginTop:6
    },questionitemcontainer:{
        padding:5,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#ab82ff',
    },
});

class BuildingBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            bookdata:null,
            bookCover:null,
            getdata:0,
            collectit:false,
            questionlist_data_source:null,
            get_qslist_data:null,
            idea_recommend_data_source:null,
            get_recommenddata:null,
            gorefreshing:false,
            //评论模块
            comments_data_source:null,
            get_comments_data:0,

        };
        this._onChange = this._onChange.bind(this);
        this._handleRandom = this.handleRandom.bind(this);
        this._handleOrder = this.handleOrder.bind(this);
        this._handleSection = this.handleSection.bind(this);
        this._renderBook = this.renderBook.bind(this);
        this._renderLoading = this.renderLoading.bind(this);
        this._doFetchBook = this.doFetchBook.bind(this);
        this._renderQuestionItem = this.renderQuestionItem.bind(this);
        this._renderDiscussItem = this.renderDiscussItem.bind(this);
        this._handleCollect = this.handleCollect.bind(this);
    }


    doFetchBook(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        bookdata:responseData.data,
                        bookCover:`${httpsBaseUrl}${responseData.data.cover}`,
                        getdata:1
                    })
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    docollect(collectitornot){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("collectid",this.props.bookid);
        formData.append("collect",collectitornot);
        formData.append("collect_type",4);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(buildingbookcollectchangeUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.collectbuildbook=JSON.parse(responseData.data);

                    this.setState({
                        collectit:global.collectbuildbook.contains(this.props.bookid)
                    })
                }else{
                    Alert.alert("提示",responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    doCloneBook(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doCloneUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok")
                }else{
                    alert(responseData.message)
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

    dofetchquestions(jump = 0){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){

                    this.setState({
                        questionlist_data_source:responseData.data,
                        get_qslist_data:1
                    })

                    if(jump == 1){
                        Actions.answerquestion({intype:0,asktype:1,buildingbookdata:responseData.data});
                    }

                }else{
                    this.setState({
                        get_qslist_data:2
                    })
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

    handleRandom() {
        var type = 'random';
        let bookqids=JSON.parse(this.state.bookdata.qids);

        if(this.state.questionlist_data_source == null){
            this.dofetchquestions(1);
        }else{
            Actions.answerquestion({intype:0,asktype:1,buildingbookdata:this.state.questionlist_data_source});
        }

    }
    handleOrder() {
        var type = 'order';
        global.bookqids=JSON.parse(this.state.bookdata.qids);
        Actions.answerquestion(type);
    }
    handleSection() {
        var type = 'section';
        global.bookqids=JSON.parse(this.state.bookdata.qids);
        Actions.answerquestion(type);
    }

    handleBeginTest() {
        Actions.begintest({intype:0,bookdata:this.state.bookdata});
    }

    handleCollect() {
        if(this.state.collectit == false){
            this.docollect(1);
        }
    }

    godropbook(){
        Alert.alert('慎重操作','真的要丢弃这本书吗?',[
            {text:'是的',onPress:()=> this.docollect(0)},
            {text:'不了'}
        ]);
    }

    rendercollectbutton(){

        if(global.collectbuildbook.contains(this.props.bookid)){
            return(

                    <TouchableOpacity onPress={() => this.godropbook()}>
                        <View style={styles.arrButton} ><Text style={{fontSize:12}}>丢弃</Text></View>
                    </TouchableOpacity>

            );
        }else{
            return(

                    <TouchableOpacity onPress={() => this.docollect(1)}>
                        <View style={styles.arrButton}><Text style={{fontSize:14}}>收藏</Text></View>
                    </TouchableOpacity>

            );
        }

    }

    renderBook(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={{uri:this.state.bookCover}}/>
                    </View>
                    <View style={styles.container2}>
                        <TouchableOpacity onPress={() => this._handleRandom()}>
                            <View style={styles.arrButton}><Text style={{fontSize:14}}>随机</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._handleOrder()}>
                            <View style={styles.arrButton}><Text style={{fontSize:14}}>顺序</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._handleSection()}>
                            <View style={styles.arrButton}><Text style={{fontSize:14}}>章节</Text></View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.container2}>
                        <TouchableOpacity onPress={() => this._handleRandom()}>
                            <View style={styles.arrButton}><Text style={{fontSize:14}}>错题</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.handleBeginTest()}>
                            <View style={styles.arrButton}><Text style={{fontSize:14}}>测试</Text></View>
                        </TouchableOpacity>
                        {this.rendercollectbutton()}

                    </View>
                </View>
                <View>
                    <SegmentedControlIOS
                        values={['介绍','评论','题目','推荐','计划','历史']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}

            </View>
        );
    }

    render(){
        if(this.state.getdata == 0){
            this._doFetchBook();
            return this._renderLoading();
        }else{
            if(this.state.bookdata == null){
                return this.rendernodata()
            }else{
                return this._renderBook();
            }
        }
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {
            return (
                this.renderIntroduceView()
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderDiscussFragment()
            )
        } else if (this.state.selectedIndex === 2) {
            if(this.state.get_qslist_data == null){
                this.dofetchquestions();
                return(this._renderLoading())
            }else{
                if(this.state.questionlist_data_source == null){
                    return(this.rendernodata())
                }else{
                    return (
                        this.renderQsListView()
                    )
                }
            }

        }else if (this.state.selectedIndex === 3) {
            if(this.state.get_recommenddata == null){
                this.dofetch_ideaquestion();
                return(this._renderLoading())
            }else{
                return (
                    this.renderIdeasView()
                )
            }

        } else if (this.state.selectedIndex === 4) {
            return (
                this.renderHistoryView()
            )
        } else if (this.state.selectedIndex === 5) {
            return (
                this.renderHistoryView()
            )
        }

    }

    clonebook(){
        this.doCloneBook();
    }

    recommendbook(){

    }

    renderIntroduceView(){
        return (
            <View style={{marginLeft:10,marginRight:10}}>

                <View style={{flexDirection:"row",alignItems:"center",marginTop:10,height:24}}>
                    <Text style={{}}>题本名字 : {this.state.bookdata.bookname}</Text>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                        <TouchableOpacity style={{marginLeft:10,borderRadius:8,width:68,height:24,backgroundColor:"#00FB00",justifyContent:"center",alignItems:"center"}} onPress={() => this.recommendbook()} >
                            <Text style={{fontSize: 14}}>推荐</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.textmargin}>题目数量 : {this.state.bookdata.q_count}</Text>
                <Text style={styles.textmargin}>题本简介 : {this.state.bookdata.bookbrief}</Text>
                <Text style={styles.textmargin}>题本详情 : {this.state.bookdata.bookdescription}</Text>
                <Text style={styles.textmargin}>题目编号 : {this.state.bookdata.qids}</Text>
                <Text style={styles.textmargin}>收藏人数 : {this.state.bookdata.collectnum}</Text>
                <View style={{flexDirection:"row",alignItems:"center",marginTop:10,height:24}}>
                    <Text style={{}}>克隆次数 : {this.state.bookdata.follow}</Text>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                        <TouchableOpacity style={{marginLeft:10,borderRadius:8,width:68,height:24,backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.clonebook()} >
                            <Text style={{fontSize: 14}}>克隆</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        )
    }

    dofetch_discuss(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("discusstype",1);
        formData.append("discussid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetDiscussUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        comments_data_source:responseData.data.reverse(),
                        get_comments_data:1
                    })
                }else{
                    this.setState({
                        get_comments_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderDiscussItem(rowData, sectionID, rowID){
        let time_o = new Date(rowData.create_at * 1000);
        //time_o.setMilliseconds(rowData.create_at);
        let time_t = time_o.toLocaleString();
        let iconColor = "#FF0000";
        return(
            <View style={{
                borderBottomWidth:1,borderBottomColor:"#0000EE",
                backgroundColor:"#F0FFEE",marginTop:4,paddingRight:2}}>
                <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontSize:12,color:"#9400D3"}}>
                        {time_t} {rowData.nickname}
                    </Text>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-end"}}>
                        <Icon name="ios-flame" size={18} color={iconColor}/>
                    </View>
                </View>

                <Text style={{fontSize:14,marginBottom:2,marginTop:2}}>
                    {rowData.content}
                </Text>

            </View>
        )
    }

    renderDiscuss(){
        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_discuss()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.comments_data_source)}
                renderRow={this._renderDiscussItem}
                enableEmptySections = {true}
            />
        )
    }

    writeComment(){
        Actions.comment({intype:1,commentid:this.props.bookid});
    }

    renderDiscussView(){
        if(this.state.get_comments_data == 0){
            this.dofetch_discuss();
            return(this.renderLoading())
        }else{
            if(this.state.comments_data_source == null){
                return(this.rendernodata())
            }else{
                return(this.renderDiscuss())
            }
        }

    }

    renderDiscussFragment(){
        return(
            <View style={{flex:1,justifyContent:"flex-end"}}>
                {this.renderDiscussView()}
                <TouchableOpacity onPress={ () =>this.writeComment()} activeOpacity={0.8}>
                    <View style={{flexDirection:'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height:32,
                        backgroundColor: '#00EE00'}}  >
                        <Text style={{fontSize: 18}}>
                            写评论
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderQuestionItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        var qId = (rowData.questionid);
        return (
            <TouchableOpacity  onPress={()=> Actions.newsomequestions({title:"题目查看",intype:1,qstlist:this.state.questionlist_data_source,index:rowID})} >
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {parseInt(rowID)+1} : {ask.substring(0,20)}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderrecommend(){
        if(this.state.idea_recommend_data_source == null){
            return(
                <EmptyData/>
            )
        }else{
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
                    renderRow={this._renderQuestionItem}
                    enableEmptySections = {true}
                />
            )
        }
    }

    renderIdeasView(){
        return (
            <View style={styles.ButtonViewContainer}>
                {this.renderrecommend()}
                <View style={styles.bottomButtonViewContainer}>
                    <TouchableOpacity  onPress={()=> Actions.newsomequestions({intype:0,bookid:this.props.bookid,title:this.state.bookdata.bookname})} >
                        <Text style={styles.bottomButtonText} >贡献</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    renderQsListView(){
        return (
            <View style={styles.ButtonViewContainer}>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.gorefreshing}
                            onRefresh={() => this.dofetchquestions()}
                        />
                    }
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.questionlist_data_source)}
                    renderRow={this._renderQuestionItem}
                    enableEmptySections = {true}
                />
            </View>

        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
    }

    renderLoading(){
        return (
            <Text>Loading ...</Text>
        )
    }

    rendernodata(){
        return (
            <Text>没有数据</Text>
        )
    }
}

BuildingBook.PropTypes = {
    bookid:PropTypes.number,
};

Array.prototype.contains = function (element) {
    for (var i=0;i<this.length;i++){
        if(this[i]==element){
            return true;
        }
    }
    return false;
};

module.exports = BuildingBook;