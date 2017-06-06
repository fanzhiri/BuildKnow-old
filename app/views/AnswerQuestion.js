/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, Image, Dimensions,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#F5FCFF',
    },
    question:{
        fontSize:24
    },
    nextperbuttoncontainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    nextperbutton:{
        width:80,
        height:30,

        backgroundColor: '#00EE00'
    },
    topButtoncontainer:{
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height:60,
    },
    topButtonitemcontainer:{
        width:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    }
});
var init_radio_props = [
    {label: 'loading 1', value: 0 },
    {label: 'loading 2', value: 1 },
    {label: 'loading 3', value: 2 },
    {label: 'loading 4', value: 3 }
];

const window = Dimensions.get('window');

var doanswerquestionpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getquestion";
var doGetQuestionGetBaseUrl = "https://slako.applinzi.com/api/1/question/";
var httpsBaseUrl = "https://slako.applinzi.com";


var question_number=0;

class AnswerQuestion extends Component {
    constructor(props) {
        super(props);
        question_number=global.bookqids.length;
        this.state = {
            count:0,
            fetchresult:null,
            questiondata:null,
            radio:init_radio_props,
            ask:null,
            selectone:-1
        };
        this._dofetchquestion = this.dofetchquestion.bind(this);
        this._renderloading = this.renderloading.bind(this);
        this._renderquestion = this.renderquestion.bind(this);
        this._showquestion = this.showquestion.bind(this);
    }

    dofetchquestion(questionid){
        let url = `${doGetQuestionGetBaseUrl}${questionid}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){
                    let rightindex = Math.floor(Math.random() * 4);
                    //let answer=Array.of(responseData.data.wrong_answer_1,responseData.data.wrong_answer_2,responseData.data.wrong_answer_3);
                    let answer=JSON.parse(responseData.data.wrong_answer);
                    let rightanswer=responseData.data.right_answer;
                    answer.splice(rightindex,0,rightanswer);

                    let radio_props = [
                        {label: answer[0], value: 0 },
                        {label: answer[1], value: 1 },
                        {label: answer[2], value: 2 },
                        {label: answer[3], value: 3 }
                    ];
                    this.setState({
                        questiondata:responseData.data,
                        fetchresult:"ok",
                        ask:responseData.data.ask,
                        radio:radio_props
                    })

                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderquestion(){
        if(this.state.questiondata == null){

            var qid=global.bookqids.shift();

            this._dofetchquestion(qid);

            return this._renderloading();
        }else{
            return this._showquestion();
        }
    }

    onPressNext(){
        this.setState({selectone:-1})
        this.setState({count:this.state.count+1})
        var qid=global.bookqids.shift();
        //global.bookqids
        global.bookqids
        this._dofetchquestion(qid);
    }

    onPressPre(){
        this.setState({selectone:-1})
        var qid=global.bookqids.shift();

        this._dofetchquestion(qid);
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
                Actions.answersetting();
                break;
            case 1:
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
        }
    }

    renderqtype(qtype){
        var questiontype=null;
        switch(parseInt(qtype)){
            case 0:questiontype="单选";
                break;
            case 1:questiontype="多选";
                break;
            case 2:questiontype="对错";
                break;
            case 3:questiontype="顺序";
                break;
            case 4:questiontype="填空";
                break;
            default:questiontype=qtype;
        }

        return(
            <Text style={styles.question}>题目类型：{questiontype}</Text>
        )
    }

    showquestion(){

        return (
            <View style={styles.container}>



                <View style={styles.topButtoncontainer}>

                    {this.rendertopbutton("md-alarm",   "时间",   () => this.invote(7))}
                    {this.rendertopbutton("md-cafe",    "评论",   () => this.invote(6))}
                    {this.rendertopbutton("md-grid",    "题卡",   () => this.invote(5))}
                    {this.rendertopbutton("md-thumbs-up","赞",    () => this.invote(4))}
                    {this.rendertopbutton("md-star",    "收藏",   () => this.invote(3))}
                    {this.rendertopbutton("md-share",   "分享",   () => this.invote(2))}
                    {this.rendertopbutton("md-stats",   "统计",   () => this.invote(1))}
                    {this.rendertopbutton("md-settings","设置",   () => this.invote(0))}
                </View>
                <Text style={styles.question}>完成进度 {this.state.count}:{question_number}</Text>
                {
                    this.state.questiondata.img?
                        <Image resizeMode="cover" source={{uri:`${httpsBaseUrl}${this.state.questiondata.img}`, width: window.width, height: 200 }} ></Image>
                        :
                        null
                }
                {this.renderqtype(this.state.questiondata.qtype)}
                <Text style={styles.question}>{this.state.questiondata.ask}</Text>
                <RadioForm

                    radio_props={this.state.radio}
                    initial={this.state.selectone}
                    onPress={(value) => {this.setState({selectone:value})}}
                />
                <View style={styles.nextperbuttoncontainer}>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressPre() }>上个</Button>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressNext()}>下个</Button>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressNext()}>不懂</Button>

                </View>

            </View>
        )
    }

    renderloading(){
        return (
            <View style={styles.container}>
                <Text>Loading question...</Text>
            </View>
        )
    }


    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this._renderquestion()}
            </View>
        )
    }
}

AnswerQuestion.PropTypes = {
    intype:PropTypes.number,          //0正在建的题本测试 1已经发布的
    questiontype: PropTypes.string.isRequired,//random随机；order顺序
    questioncount:PropTypes.number,
    // bookid:PropTypes.string.isRequired,
    // qids:PropTypes.array.isRequired,
    publicbookdata:PropTypes.object
};

module.exports = AnswerQuestion;