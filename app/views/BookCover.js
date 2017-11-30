/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet,Alert, SegmentedControlIOS,ListView,RefreshControl,TouchableOpacity} from "react-native";

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

import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
import Icon from 'react-native-vector-icons/Ionicons';
import EmptyData from '../component/EmptyData';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    thiscontainer: {
        padding:10
    },
    container1: {
        margin:10,
        flexDirection:'row',
        height:80,
        marginBottom:0,
    },
    container2: {
        flex:1,
        marginLeft:10,
    },
    container3: {
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        height:24,
        marginRight:10,
    },
    image:{
        width:80,
        height:80,
        borderRadius:16,
    },
    segmented:{
        marginTop:8,
        width:240,
        alignSelf:'center'
    },
    looklookButton:{
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:6,
        marginRight:8,
        width:78,height:24,
        backgroundColor: '#00FF7F',
    },
    obtainButton:{
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:6,
        marginRight:8,
        width:58,height:24,
        backgroundColor: '#00FF7F',
    },
    dropButton:{
        justifyContent: 'center',
        alignItems:'center',
        marginRight:8,
        borderRadius:6,
        width:38,height:24,
        backgroundColor: '#FF0000',
    },
    nameText:{
        fontSize: 20,
    },
    briefText:{
        marginTop:8,
        fontSize: 14,
    },
    textmargin:{
        marginTop:10,
    }
});

var httpsBaseUrl = "https://slako.applinzi.com/";

var bookcollectchangeUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=bookcollectchange";

var getpublicbookUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getpublicbook";

var doGetDiscussUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getdiscuss";

var doGetTestRankUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=gettestrank";

class BookCover extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            bookdata:null,
            collectit:false,
            comments_data_source:null,
            get_comments_data:0,

            rank_data_source:null,
            get_rank_data:0,

            gorefreshing:false,
        };
        this._onChange = this._onChange.bind(this);
        this._renderDiscussItem = this.renderDiscussItem.bind(this);
        this._renderRankItem = this.renderRankItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gorefresh == null){
            return;
        }
        this.dofetch_discuss();
    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    dofetch_rank(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("publicbookid",this.state.bookdata.reviewid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetTestRankUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        rank_data_source:responseData.data,
                        get_rank_data:1
                    })
                }else{
                    this.setState({
                        get_rank_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_discuss(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("discusstype",0);
        formData.append("discussid",this.state.bookdata.reviewid);

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

    docollect(collectitornot){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("publishbookid",this.state.bookdata.reviewid);
        formData.append("collect",collectitornot);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(bookcollectchangeUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.bookcollect=JSON.parse(responseData.data);
                    this.setState({
                        collectit:global.bookcollect.contains(this.state.bookdata.reviewid)
                    })
                }else{
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dogetpublicbook(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("publishbookid",this.props.bookpublicid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getpublicbookUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        bookdata:responseData.data
                    })
                }else{
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    godropbook(){
        Alert.alert('慎重操作','真的要丢弃这本书吗?',[
            {text:'是的',onPress:()=> this.docollect(0)},
            {text:'不了'}
        ]);
    }

    sharebook(){
        Actions.friendlist({title:"题本分享给朋友",inmode:1,intype:3,bookid:this.state.bookdata.reviewid});
    }

    looklook(){
        // Actions.answerquestion({
        //     intype:1,
        //     publicbookdata:this.state.bookdata,
        //     questioncount:10,
        //     asktype:0,
        //     answermode:0
        // });
    }

    rendercollectbutton(){

        if(global.bookcollect.contains(this.state.bookdata.reviewid)){
            return(
                <View style={styles.container3}>
                    <TouchableOpacity onPress={() => this.godropbook()}>
                        <View style={styles.dropButton} ><Text style={{fontSize:12}}>丢弃</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.sharebook()}>
                        <View style={styles.obtainButton}><Text style={{fontSize:12}}>分享</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Actions.publicbook({bookid:this.state.bookdata.reviewid,title:this.state.bookdata.bookname})}>
                        <View style={styles.obtainButton} ><Text style={{fontSize:12}}>进入</Text></View>
                    </TouchableOpacity>
                </View>
            );
        }else{
            return(
                <View style={styles.container3}>
                    <TouchableOpacity onPress={() => this.looklook()}>
                        <View style={styles.looklookButton} ><Text style={{fontSize:12}}>随便看看</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.sharebook()}>
                        <View style={styles.obtainButton}><Text style={{fontSize:12}}>分享</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.docollect(1)}>
                        <View style={styles.obtainButton}><Text style={{fontSize:12}}>收藏</Text></View>
                    </TouchableOpacity>
                </View>
            );
        }

    }


    render(){
        return (
                this.renderBookView()
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderBookView(){
        if(this.state.bookdata == null){
            this.dogetpublicbook();
            return (this.renderLoading())
        }else{
            return (this.renderBook())
        }
    }

    renderBook(){

        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.thiscontainer]}>
                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={{uri:`${httpsBaseUrl}${this.state.bookdata.cover}`}} />
                    </View>
                    <View style={styles.container2}>
                        <Text style={styles.nameText}>{this.state.bookdata.bookname}</Text>
                        <Text style={styles.briefText}>{this.state.bookdata.bookbrief}</Text>
                    </View>
                </View>
                {this.rendercollectbutton()}

                <View>
                    <SegmentedControlIOS
                        values={['介绍','评论','排行']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>

        );
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
            return (
                this.renderHistoryView()
            )
        }
    }

    renderIntroduceView(){
        let time_o = new Date();
        time_o.setMilliseconds(this.state.bookdata.releasetime);
        let time_t = time_o.toLocaleString();
        return (
            <View>

                <Text style={styles.textmargin}>简介 :{this.state.bookdata.bookbrief}</Text>

                <Text style={styles.textmargin}>详情 :{this.state.bookdata.bookdescription}</Text>
                <Text style={styles.textmargin}>题目数量 :{this.state.bookdata.questioncount}</Text>
                <Text style={styles.textmargin}>版本 :{this.state.bookdata.version}</Text>
                <Text style={styles.textmargin}>更新日期 :{time_t}</Text>
                <Text style={styles.textmargin}>语言 :中文</Text>
                <Text style={styles.textmargin}>作者 :slako</Text>
                <Text style={styles.textmargin}>类别 :{this.state.bookdata.classifypath}</Text>
                <Text style={styles.textmargin}>题目编号 :{this.state.bookdata.qids}</Text>
                <Text style={styles.textmargin}>关注人数 :{this.state.bookdata.follow}</Text>
                <Text style={styles.textmargin}>测试人数 :{this.state.bookdata.testtime}</Text>
                <Text style={styles.textmargin}>测试次数 :{this.state.bookdata.testtime}</Text>
            </View>
        )
    }

    renderDiscussItem(rowData, sectionID, rowID){
        let time_o = new Date();
        time_o.setMilliseconds(rowData.create_at);
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

    renderRankItem(rowData,sectionID, rowID){
        let time_o = new Date();
        time_o.setMilliseconds(rowData.begintime);
        let time_t = time_o.toLocaleString();
        return(
            <View style={{
                height:32,
                borderBottomWidth:1,
                borderBottomColor:'#e464e4',
                flexDirection:"row",
                alignItems:"center"
            }}>
                <Text>得分:{rowData.score}  </Text>
                <Text>题数:{rowData.qstnum}  </Text>
                <Text>开始:{time_t}  </Text>
                <Text>耗时:{rowData.taketime}  </Text>
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

    renderRank(){
        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_rank()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.rank_data_source)}
                renderRow={this._renderRankItem}
                enableEmptySections = {true}
            />
        )
    }

    writeComment(){
        Actions.comment({intype:0,commentid:this.props.bookpublicid});
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

    renderDiscussView(){
        if(this.state.get_comments_data == 0){
            this.dofetch_discuss();
            return(this.renderLoading())
        }else{
            if(this.state.comments_data_source == null){
                return(<EmptyData/>)
            }else{
                return(this.renderDiscuss())
            }
        }

    }

    renderHistoryView(){

        if(this.state.get_rank_data == 0){
            this.dofetch_rank();
            return(this.renderLoading())
        }else{
            if(this.state.rank_data_source == null){
                return(<EmptyData/>)
            }else{
                return(this.renderRank())
            }
        }
    }

    rendernodata(){
        return (
            <Text>没有数据</Text>
        )
    }
}

BookCover.PropTypes = {
    bookpublicid: PropTypes.number,
    gorefresh: PropTypes.number,
};

Array.prototype.contains = function (element) {
    for (var i=0;i<this.length;i++){
        if(this[i]==element){
            return true;
        }
    }
    return false;
}

module.exports = BookCover;