/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,TouchableHighlight,PropTypes} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import TcombForm from "tcomb-form-native";

var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});

var NewQuestion = TcombForm.struct({
    ask: TcombForm.String,
    rightanswer: TcombForm.String,
    wronganswier1: TcombForm.String,
    wronganswier2: TcombForm.String,
    wronganswier3: TcombForm.String,
});

var options = {};

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";



class NewOneQuestion extends Component {

    constructor(props) {

        super(props);

    }

    docommit(newquestion){
        const {bookid} = this.props;
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",bookid);
        formData.append("ask",newquestion.ask);
        formData.append("right_answer",newquestion.rightanswer);
        formData.append("wrong_answer_1",newquestion.wronganswier1);
        formData.append("wrong_answer_2",newquestion.wronganswier2);
        formData.append("wrong_answer_3",newquestion.wronganswier3);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(docommitpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onPress(){
        var value = this.refs.form.getValue();

        if (value != null) {
            this.docommit(value);
        }else{
            alert("rightanswer not set ");
        }
    }

    render(){
         const {bookid} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <Tform
                    ref="form"
                    type={NewQuestion}
                    options={options}
                />

                <Button onPress={() => this.onPress()}>为{bookid}添加题目</Button>
            </View>
        );
    }
}

NewOneQuestion.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = NewOneQuestion;