/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#F5FCFF',
    },
    question:{
        fontSize:24
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

class AnswerQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count:0,
            fetchresult:null,
            questiondata:null,
            radio:init_radio_props,
            ask:null,
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
                    let answer=Array.of(responseData.data.wrong_answer_1,responseData.data.wrong_answer_2,responseData.data.wrong_answer_3);
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
            this._dofetchquestion(4);

            return this._renderloading();
        }else{
            return this._showquestion();
        }
    }

    showquestion(){

        return (
            <View style={styles.container}>
                <Image source={{uri:'https://slako.applinzi.com/statics/images/question/personalhomepage/1.jpg', width: window.width, height: 200 }} />
                <Text style={styles.question}>{this.state.ask}</Text>
                <RadioForm
                    radio_props={this.state.radio}
                    initial={-1}
                    onPress={(value) => {this.setState({value:value})}}
                />
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
    questiontype: PropTypes.string.isRequired,
    // bookid:PropTypes.string.isRequired,
    // qids:PropTypes.array.isRequired,
};

module.exports = AnswerQuestion;