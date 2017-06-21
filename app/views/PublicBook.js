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
    datacontainer:{
        padding:10,
        flexDirection:'row',
        alignItems: 'center',
        height:100,
    },
    dataitemcontainer:{
        flex: 1,
    },
    topButtoncontainer:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height:60,
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
        };

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
        var iconColor="#FF0000";
        return(
            <TouchableOpacity onPress={onpressfunc} activeOpacity={0.8}>
                <View style={styles.topButtonitemcontainer}>
                    <View style={styles.IconItem}>
                        <Icon name={iconname} size={22} color={iconColor}/>
                    </View>
                    <Text>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    invote(idx){
        switch (idx){
            case 0:
                Actions.answerquestion({
                    intype:1,
                    publicbookdata:this.state.bookdata,
                    questioncount:10,
                    asktype:0,
                    answermode:0
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
                Actions.answerquestion({
                    intype:1,
                    publicbookdata:this.state.bookdata,
                    questioncount:10,
                    asktype:0,
                    answermode:2
                });
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
                    <View style={styles.topButtoncontainer}>
                        {this.rendertopbutton("md-medal",   "比拼",   () => this.invote(17))}
                        {this.rendertopbutton("md-medkit",  "错题",   () => this.invote(2))}
                        {this.rendertopbutton("md-medkit",  "记录",   () => this.invote(2))}
                        {this.rendertopbutton("md-medkit",  "排行",   () => this.invote(2))}
                    </View>
                </View>

            )
        }
    }

    renderbook(){
        return(
            <View >
                <View  style={styles.datacontainer}>
                    <ScrollView style={styles.dataitemcontainer}>
                        <Text>熟练程度：</Text>
                        <Text>做题数：</Text>
                        <Text>未看题数：</Text>
                        <Text>测试次数：</Text>
                        <Text>最近均分：</Text>
                        <Text>错题数：</Text>
                    </ScrollView>
                    <ScrollView style={styles.dataitemcontainer}>
                        <Text>熟练程度：</Text>
                        <Text>做题数：</Text>
                        <Text>未看题数：</Text>
                        <Text>测试次数：</Text>
                        <Text>最近均分：</Text>
                        <Text>错题数：</Text>
                    </ScrollView>
                </View>

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
                <View style={styles.topButtoncontainer}>
                    {this.rendertopbutton("md-eye","熟练计划",   () => this.invote(22))}
                    {this.rendertopbutton("md-eye","前后版本",   () => this.invote(0))}
                    {this.rendertopbutton("md-locate","在建地址",() => this.invote(21))}
                </View>
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