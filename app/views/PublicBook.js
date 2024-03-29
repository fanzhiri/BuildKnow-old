/**
 * Created by slako on 17/05/31.
 *
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet, SegmentedControlIOS,TouchableOpacity,ScrollView} from "react-native";

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

import Icon from 'react-native-vector-icons/Ionicons';

import {Menu,MenuOptions,MenuOption,MenuTrigger,renderers} from 'react-native-popup-menu'

const {SlideInMenu}=renderers;

import GlobleStyles from '../styles/GlobleStyles';

var doGetBookBaseUrl = "https://slako.applinzi.com/api/1/publicbook/";
var httpsBaseUrl = "https://slako.applinzi.com/";


var doGetCollectBookDataUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getcollectbookdata";

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
    },
    container2: {
        flex: 2,
        marginLeft:10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    datacontainer:{
        padding:4,
        flexDirection:'row',
        alignItems: 'center',
        height:160,
    },
    dataitemcontainer:{
        flex: 1,
        height:140,
        borderRadius:12,
        backgroundColor:"#90FF90",
        margin:4,
        padding:6
    },
    topButtoncontainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height:68,
        paddingLeft:10,
        paddingRight:10
    },
    topButtonitemcontainer:{
        width:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    },
});

class PublicBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readortest:0,//0看题 1测试
            bookdata:null,
            getdata:null,
            collectbookdata:null,
        };

    }

    componentDidMount(){
        this.dofetch_collectbookdata();
    }

    dofetch_collectbookdata(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetCollectBookDataUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        collectbookdata:responseData.data,
                    })
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    doFetchBook(bookid){
        let url = `${doGetBookBaseUrl}${bookid}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){

                    this.setState({
                        bookdata:responseData.data,
                        fetchresult:"ok",
                        getdata:1
                    })

                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    rendertopbutton(iconname,name,onpressfunc){

        var iconColor="#00FF00";
        if(this.state.readortest != 0){
            iconColor = "#00E0F0";
        }
        return(
            <TouchableOpacity onPress={onpressfunc} activeOpacity={0.8}>
                <View style={styles.topButtonitemcontainer}>
                    <View style={styles.IconItem}>
                        <Icon name={iconname} size={32} color={iconColor}/>
                    </View>
                    <Text style={{fontSize:18}}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    handleBeginTest() {
        Actions.begintest({intype:0,bookdata:this.state.bookdata});
    }

    invote(idx){
        switch (idx){
            case 0:
                Actions.answerquestion({
                    title:"看题:"+this.state.bookdata.bookname,
                    intype:1,
                    publicbookdata:this.state.bookdata,
                    questioncount:10,
                    asktype:0,
                    answermode:0//看题
                });
                break;
            case 1:
                Actions.answerquestion({
                    intype:1,
                    publicbookdata:this.state.bookdata,
                    questioncount:10,
                    asktype:1,
                    answermode:0
                });
                break;
            case 2:
                Actions.testresult({bookid:this.props.bookid});
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                Actions.testcard();
                break;
            case 6:
                break;
            case 7:
                break;
            case 10:
                this.handleBeginTest();
                break;
            case 17:
                Actions.newcompetition({book:this.state.bookdata});
                break;
            case 21:
                //题本在建地址
                Actions.buildingbook({bookid:this.state.bookdata.bookid});
                break;
            case 22:
                //熟练计划
                Actions.schedule({intype:1,book:this.state.bookdata});
                break;
        }
    }

    onSegmentChange(event) {
        this.setState({
            readortest: event.nativeEvent.selectedSegmentIndex,
        });
    }

    renderreadortest(){
        if(this.state.readortest == 0){
            //看题
            return(
                <View style={styles.topButtoncontainer}>
                    {this.rendertopbutton("md-eye",     "顺序",   () => this.invote(0))}
                    {this.rendertopbutton("md-locate",  "章节",   () => this.invote(1))}
                    {this.rendertopbutton("md-medal",   "已看",   () => this.invote(1))}
                    {this.rendertopbutton("md-medkit",  "未看",   () => this.invote(2))}
                    {this.rendertopbutton("md-flower",  "随机",   () => this.invote(1))}
                    {this.rendertopbutton("md-flower",  "收藏",   () => this.invote(3))}
                </View>
            )
        }else{
            //做题
            return(
                <View>
                    <View style={styles.topButtoncontainer}>
                        {this.rendertopbutton("md-eye",     "顺序",   () => this.invote(10))}
                        {this.rendertopbutton("md-locate",  "章节",   () => this.invote(1))}
                        {this.rendertopbutton("md-medal",   "已看",   () => this.invote(1))}
                        {this.rendertopbutton("md-medkit",  "未看",   () => this.invote(2))}
                        {this.rendertopbutton("md-flower",  "随机",   () => this.invote(1))}
                        {this.rendertopbutton("md-flower",  "收藏",   () => this.invote(3))}
                    </View>

                </View>

            )
        }
    }

    renderListItem(iconname,title,onpressfunc){
        var iconColor="#90F000";
        return(
            <TouchableOpacity onPress={onpressfunc} activeOpacity={0.8}>
                <View style={{height:42,flexDirection:"row",alignItems:"center",borderBottomWidth:0.5, borderColor:'#48e8e8',paddingLeft:10}}>
                    <Text style={{fontSize:18}}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderDetialdata(){
        if(this.state.collectbookdata == null ){
            return;
        }
        return(
            <View  style={styles.datacontainer}>
                <ScrollView style={styles.dataitemcontainer}>
                    <Text>熟练程度：{this.state.collectbookdata.proficiency} </Text>
                    <Text>总测题数：{this.state.collectbookdata.qstallnum} </Text>
                    <Text>答对次数：{this.state.collectbookdata.rightalltime} </Text>
                    {/*<Text>未看题数：</Text>*/}
                    <Text>测试次数：{this.state.collectbookdata.testtime}</Text>
                    {/*<Text>最近均分：</Text>*/}
                    {/*<Text>错题数：</Text>*/}
                </ScrollView>
                <ScrollView style={styles.dataitemcontainer}>
                    <Text>熟练排行：</Text>
                    <Text>做题数：</Text>
                    <Text>未看题数：</Text>
                    <Text>测试次数：</Text>
                    <Text>最近均分：</Text>
                    <Text>错题数：</Text>
                </ScrollView>
            </View>
        )
    }

    renderDetialdataTitle(){
        return(
            <View  style={{margin:2,flexDirection:'row',alignItems: 'center'}}>
                <View style={{flex:1,alignItems: 'center',height:20,justifyContent:"center"}}>
                    <Text style={{flex:1,fontSize:18,alignItems: 'center'}}>个人</Text>
                </View>
                <View style={{flex:1,alignItems: 'center',height:20,justifyContent:"center"}}>
                    <Text style={{flex:1,fontSize:18,alignItems: 'center'}}>排行</Text>
                </View>
            </View>
        )
    }

    renderbook(){
        return(
            <View >
                {this.renderDetialdataTitle()}
                {this.renderDetialdata()}

                <View style={styles.segmentcontainer}>
                    <SegmentedControlIOS
                        values={['看题', '做题']}
                        selectedIndex={this.state.readortest}
                        style={styles.segmented}
                        onChange={(event) => {
                            this.onSegmentChange(event)
                        }}
                    />
                </View>
                {this.renderreadortest()}

                {this.renderListItem("md-medal",   "出卷",   () => this.invote(17))}
                {this.renderListItem("md-medkit",  "错题",   () => this.invote(2))}
                {this.renderListItem("md-medkit",  "记录",   () => this.invote(2))}
                {this.renderListItem("md-medkit",  "排行",   () => this.invote(2))}

                {this.renderListItem("md-eye","熟练计划",   () => this.invote(22))}
                {this.renderListItem("md-eye","前后版本",   () => this.invote(3))}
                {this.renderListItem("md-locate","在建地址",() => this.invote(21))}

            </View>
        )
    }

    renderswitch(){
        if(this.state.getdata==null){
            this.doFetchBook(this.props.bookid)
            return this.renderLoading()
        }else{
            return this.renderbook();
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderswitch()}
            </View>
        );
    }


    renderLoading(){
        return (
            <Text>Loading ...</Text>
        )
    }
}

//界面关键点
//看题（随机、章节、），测验，发起考试，日程安排，好友等级排行，考试记录，熟练计划，前后版本，该本的在建地址

PublicBook.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = PublicBook;