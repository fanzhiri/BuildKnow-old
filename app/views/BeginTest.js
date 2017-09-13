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

class BeginTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bookquestion_data_source:null,
            modeselect_idx:0
        };
    }

    fetch_bookquestion(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookdata.question_book_id);
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
                        bookquestion_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    handleBeginTest() {
        Actions.begintest({intype:0,bookdata:this.state.bookdata});
    }

    onModePressFunc(idx){
        this.setState({
            modeselect_idx:idx
        });
    }

    onModeAdjustFunc(){

    }

    renderadjust(idx){
        let adjusttext="";
        let select_background_collor = "#FFFFFF";
        if(this.state.modeselect_idx == idx){
            adjusttext="调整";
            select_background_collor="#FF8000";
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

    renderModeItem(idx){
        let select_this=idx;
        let select_background_collor = "#FFFF00";
        if(this.state.modeselect_idx == idx){
            select_this= "选中"+idx;
            select_background_collor="#FF8000";
        }
        return(
            <View style={{flex:1,backgroundColor:select_background_collor}}>
                <TouchableOpacity onPress={()=> this.onModePressFunc(idx)} activeOpacity={0.8}>
                    <View style={{height:32,backgroundColor:"#F00FFF",justifyContent:"center",alignItems:"center"}}>
                        <Text>{select_this}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>1</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>2</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>3</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>4</Text>
                </View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>5</Text>
                </View>

                {this.renderadjust(idx)}

            </View>
        )
    }
    renderModeTitleItem(title){
        return(
            <View style={{flex:1,justifyContent:"center"}}>
                <Text style={{fontSize:18}}>{title}</Text>
            </View>
        )
    }
    rendercommontest(){
        return(
            <View style={{flex:1}}>
                <Text style={styles.textdesc}>名字：{this.props.bookdata.bookname}</Text>
                <Text style={styles.textdesc}>总题数：{this.props.bookdata.questioncount}</Text>
                <View style={{flex:1,flexDirection:"row",height:108,margin:16,backgroundColor:"#FFFFFF"}}>
                    <View style={{flex:2}}>
                        <View style={{height:32}}></View>
                        {this.renderModeTitleItem("限定题数：")}
                        {this.renderModeTitleItem("总限定时间：")}
                        {this.renderModeTitleItem("每题限定时：")}
                        {this.renderModeTitleItem("错题量结束：")}
                        {this.renderModeTitleItem("反悔：")}
                        {this.renderModeTitleItem("")}
                    </View>
                        {this.renderModeItem(0)}
                        {this.renderModeItem(1)}
                        {this.renderModeItem(2)}
                        {this.renderModeItem(3)}
                </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.beginButton}  onPress={ () =>this.handleBeginTest()}>
                        <Text style={{fontSize: 18}}>
                            开始测验
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    goingtopktest(){
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
                    <View style={styles.beginButton}  onPress={ () =>this.goingtopktest()}>
                        <Text style={{fontSize: 18}}>
                            开始测验
                        </Text>
                    </View>
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