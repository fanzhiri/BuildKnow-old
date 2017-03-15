/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

var doanswerquestionpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=answerquestion";

class AnswerQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count:0,
            fetchresult:null,
            questiondata:null,
            radio:init_radio_props
        };
        this._dofetchquestion = this.dofetchquestion.bind(this);
        this._renderloading = this.renderloading.bind(this);
    }

    dofetchquestion(questionid){
        let formData = new FormData();
        formData.append("questionid",questionid);
        formData.append("api","true");

        var opts = {
            method:"POST",
            body:formData
        }

        fetch(dologinpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){
                    this.setState({
                        questiondata:responseData.data,
                        fetchresult:"ok"
                    })
                    Actions.main();
                }else{
                    this.setState({
                        fetchresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderquestion(){
        if(this.state.questiondata == null){
            this._renderloading();
            const {questiontype} = this.props;
            if(questiontype == 'order'){
                this._dofetchquestion(22);
            }

        }else{

        }
    }

    showquestion(){
        return(
            <View>
                <Image source={{uri:'https://slako.applinzi.com/statics/images/question/personalhomepage/1.jpg', width: window.width, height: 200 }} />
                <Text style={styles.question}>please AnswerQuestion</Text>
                <RadioForm
                    radio_props={this.state.radio}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}
                />
            </View>
        );
    }

    renderloading(){
        return(
            <View>
                <Image source={{uri:'https://slako.applinzi.com/statics/images/question/personalhomepage/1.jpg', width: window.width, height: 200 }} />
                <Text style={styles.question}>please AnswerQuestion</Text>
                <RadioForm
                    radio_props={this.state.radio}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}
                />
            </View>
        );
    }


    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this._renderquestion()}
            </View>
        );
    }
}

AnswerQuestion.PropTypes = {
    questiontype: PropTypes.string.isRequired,
    bookid:PropTypes.string.isRequired,
    qids:PropTypes.array.isRequired,
};

module.exports = AnswerQuestion;