/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

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

    showquestion(){

        return (
            <View style={styles.container}>

                {
                    this.state.questiondata.img?
                        <Image resizeMode="cover" source={{uri:`${httpsBaseUrl}${this.state.questiondata.img}`, width: window.width, height: 200 }} ></Image>
                        :
                        <Text></Text>
                }
                <Text style={styles.question}>完成进度 {this.state.count}:{question_number}</Text>
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
                {/*<Text>abc</Text>*/}
            </View>
        )
    }
}

AnswerQuestion.PropTypes = {
    questiontype: PropTypes.string.isRequired,//random随机；order顺序
    questioncount:PropTypes.number,
    // bookid:PropTypes.string.isRequired,
    // qids:PropTypes.array.isRequired,
};

module.exports = AnswerQuestion;