/**
 * Created by slako on 17/4/30.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,Dimensions,ScrollView,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import Button from 'apsl-react-native-button'

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },beginButton:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:32,
        backgroundColor: '#00EE00'
    },
    textdesc:{
        fontSize:20
    },
    buttonContainer:{
        flex: 1,
        justifyContent: 'flex-end',
    }

});

var doGetBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbookquestion";

class BeginTest extends Component {

    constructor(props) {
        super(props);

        let t_defaultMode={
            qst_num:8,
            all_time:2,//min
            one_time:0,
            wrong_end:10,
            range:0,//0全部、1已看、2未看、3错题、4收藏、5章节
            pull_back:"yes"
        };

        this.state = {
            bookquestion_data_source:[null,null,null,null],//每次选中新的未准备好的模式，都要重新生成，
            modeselect_idx:0,
            defaultMode:t_defaultMode,
            testMode:[t_defaultMode,null,null,null],
            adjust:0,
            fetching:0
        };
    }

    fetch_bookquestion(idx){
        if(this.state.fetching == 1){
            return;
        }
        this.setState({
            fetching:1
        });
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookdata.question_book_id);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    let t_bookquestion_data_source=this.state.bookquestion_data_source;
                    t_bookquestion_data_source[this.state.modeselect_idx]=responseData.data;
                    this.setState({
                        bookquestion_data_source:t_bookquestion_data_source,
                        fetching:0
                    })
                }else{
                    alert(responseData.message);
                    this.setState({
                        fetching:0
                    });
                }

            })
            .catch((error) => {
                alert(error);
                this.setState({
                    fetching:0
                });
            })
    }

    onModePressFunc(idx){
        if(this.state.adjust == 1){
            return;
        }
        if(this.state.testMode[idx] == null){
            return;
        }
        this.setState({
            modeselect_idx:idx
        });
    }

    onModeAdjustFunc(idx){
        if(this.state.modeselect_idx == idx){
            this.setState({
                adjust:(this.state.adjust==1)?0:1
            });
        }
    }

    renderadjust(idx){
        let adjusttext="";
        let select_background_collor = "#FFFFFF";
        if(this.state.testMode[idx] == null){
            adjusttext="添加";
        }
        if(this.state.modeselect_idx == idx){
            adjusttext="调整";
            select_background_collor="#FF8000";
            if(this.state.adjust == 1){
                adjusttext="保存";
                select_background_collor="#8EF9E0";
            }
        }
            return(
                <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:select_background_collor}}>
                    <TouchableOpacity
                        onPress={()=> this.onModeAdjustFunc(idx)}
                        activeOpacity={0.8}>
                    <Text>{adjusttext}</Text>
                    </TouchableOpacity>
                </View>
            )

    }

    renderRangeText(range){
        let rangeText = "";
        switch (range){
            //0全部、1已看、2未看、3错题、4收藏、5章节
            case 0:rangeText = "全部";break;
            case 1:rangeText = "已看";break;
            case 2:rangeText = "未看";break;
            case 3:rangeText = "错题";break;
            case 4:rangeText = "收藏";break;
            case 5:rangeText = "章节";break;
            default:rangeText = "";
        }
        return(
            <Text>
                {rangeText}
            </Text>
        )
    }

    renderModeItem(idx){
        let select_this=idx;
        let select_background_collor = "#FFFF00";
        if(this.state.modeselect_idx == idx){
            select_this= "选中"+idx;
            select_background_collor="#FF8000";
        }
        let nowTestMode =this.state.testMode[idx];
        let t_defaultMode={
            qst_num:"",
            all_time:"",//min
            one_time:"",
            wrong_end:"",
            range:"",
            pull_back:""
        };


        if(nowTestMode == null){
            nowTestMode = t_defaultMode;
        }
        return(
            <View style={{flex:1,backgroundColor:select_background_collor}}>
                <TouchableOpacity onPress={()=> this.onModePressFunc(idx)} activeOpacity={0.8}>
                    <View style={{height:32,backgroundColor:"#F00FFF",justifyContent:"center",alignItems:"center"}}>
                        <Text>{select_this}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>{nowTestMode.qst_num}</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>{nowTestMode.all_time}</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>{nowTestMode.one_time}</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>{nowTestMode.wrong_end}</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    {this.renderRangeText(nowTestMode.range)}
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>{nowTestMode.pull_back}</Text>
                </View>

                {this.renderadjust(idx)}

            </View>
        )
    }
    renderModeTitleItem(title){
        return(
            <View style={{flex:1.6,justifyContent:"center"}}>
                <Text style={{fontSize:16}}>{title}</Text>
            </View>
        )
    }

    handleBeginCommonTest(){
        let t_questiondataarr = JSON.parse(this.props.bookdata.qidtext);
        //let t_questiondataarr = this.state.bookquestion_data_source[this.state.modeselect_idx];
        let nowTestMode = this.state.testMode[this.state.modeselect_idx];

        let arrlength = t_questiondataarr.length;


        //let t_questiondataarr_random = t_questiondataarr.sort(function () {
        //   return Math.random()>0.5;
        //});
        //t_questiondataarr = t_questiondataarr_random.slice(0,nowTestMode.qst_num);
        let ask_arr = new Array();
        let answer_arr = new Array();
        for(let i=0;i < nowTestMode.qst_num;i++){
            let askindex = Math.floor(Math.random() * arrlength);
            let t_questiondata = t_questiondataarr[askindex];
            ask_arr.push(t_questiondataarr[askindex]);
            t_questiondataarr.splice(askindex,1);
            arrlength=arrlength -1;
            let rightindex = Math.floor(Math.random() * 4);
            let answerarr=JSON.parse(t_questiondata.wrong_answer);
            let rightanswer=t_questiondata.right_answer;
            answerarr.splice(rightindex,0,rightanswer);
            answer_arr.push({ri:rightindex,randomanswer:answerarr});
        }

        Actions.answerquestion({
            intype:2,
            bookdata:this.props.bookdata,
            readyquestion_arr:ask_arr,
            answer_arr:answer_arr,
            answermode:1});
    }

    renderNextButton(){
        /*
        if(this.state.bookquestion_data_source[this.state.modeselect_idx] == null){
            let buttontext="生成试卷";
            if(this.state.fetching == 1){
                buttontext="生成中。。。";
            }
            return(
                <TouchableOpacity onPress={ () =>this.fetch_bookquestion()} activeOpacity={0.8}>
                    <View style={[styles.beginButton,{backgroundColor: '#D09E30'}]}  >
                        <Text style={{fontSize: 18}}>
                            {buttontext}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }else{
        */
            return(
                <TouchableOpacity onPress={ () =>this.handleBeginCommonTest()} activeOpacity={0.8}>
                    <View style={styles.beginButton}  >
                        <Text style={{fontSize: 18}}>
                            开始测验
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        //}

    }

    rendercommontest(){
        return(
            <View style={{flex:1}}>
                <Text style={styles.textdesc}>名字：{this.props.bookdata.bookname}</Text>
                <Text style={styles.textdesc}>总题数：{this.props.bookdata.questioncount}</Text>
                <View style={{flex:1,flexDirection:"row",height:108,margin:16,padding:8,backgroundColor:"#FFFFFF"}}>
                    <View style={{flex:2}}>
                        <View style={{height:32}}></View>
                        {this.renderModeTitleItem("限定题数：")}
                        {this.renderModeTitleItem("总限定时间：")}
                        {this.renderModeTitleItem("每题限定时：")}
                        {this.renderModeTitleItem("错题量结束：")}
                        {this.renderModeTitleItem("范围：")}
                        {this.renderModeTitleItem("反悔：")}
                        {this.renderModeTitleItem("")}
                    </View>
                        {this.renderModeItem(0)}
                        {this.renderModeItem(1)}
                        {this.renderModeItem(2)}
                        {this.renderModeItem(3)}
                </View>

                <View style={styles.buttonContainer}>
                    {this.renderNextButton()}
                </View>
            </View>
        )
    }

    handleBeginTest(){
        let t_questiondataarr = JSON.parse(this.props.pkdata.questionsready);

        let answer_arr = new Array();
        for(let i=0;i < this.props.pkdata.testnum;i++){
            let rightindex = Math.floor(Math.random() * 4);

            let t_questiondata = t_questiondataarr[i];
            let answerarr=JSON.parse(t_questiondata.wrong_answer);
            let rightanswer=t_questiondata.right_answer;
            answerarr.splice(rightindex,0,rightanswer);
            answer_arr.push({ri:rightindex,randomanswer:answerarr});
        }

        Actions.answerquestion({intype:2,readyquestion_arr:t_questiondataarr,answer_arr:answer_arr,answermode:2});
    }

    renderpktest(){
        let pkpeople = JSON.parse(this.props.pkdata.people);
        return(
            <View>
                <Text style={styles.textdesc}>名字：{this.props.pkdata.bookname}</Text>
                <Text style={styles.textdesc}>题数：{this.props.pkdata.testnum}</Text>

                <Text style={styles.textdesc}>限定时长：</Text>
                <Text style={styles.textdesc}>参与人数：{pkpeople.length}</Text>
                <Text style={styles.textdesc}>截止时间：{this.props.pkdata.overdue}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={ () =>this.handleBeginTest()} activeOpacity={0.8}>
                        <View style={styles.beginButton}  >
                            <Text style={{fontSize: 18}}>
                                开始测验
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderbegin(){
        switch (parseInt(this.props.intype)){
            case 0:
                return this.rendercommontest();
                break;
            case 1:
                return this.renderpktest();
                break;
            default:
                break;
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderbegin()}
            </View>
        );
    }
}

BeginTest.PropTypes = {
    intype:PropTypes.number,// 0普通测试 1:pk邀请
    bookdata: PropTypes.object,
    pkdata:PropTypes.object
};

module.exports = BeginTest;