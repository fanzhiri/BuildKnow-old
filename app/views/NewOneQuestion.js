/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,TouchableHighlight} from 'react';
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

    docommit(newquestion){
        let formData = new FormData();
        formData.append("ask",newquestion.ask);
        formData.append("rightanswer",newquestion.rightanswer);
        formData.append("wronganswier1",newquestion.wronganswier1);
        formData.append("wronganswier2",newquestion.wronganswier2);
        formData.append("wronganswier3",newquestion.wronganswier3);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doregisterpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        registerresult:"ok"
                    })

                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onPress(){
        var value = this.refs.form.getValue();
        
        if (value != null) {
            //this.docommit(value);
        }else{
            alert("rightanswer not set ");
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Tform
                    ref="form"
                    type={NewQuestion}
                    options={options}
                />
                {/*<TouchableHighlight style={styles.button} onPress={()=>this.onPress()} underlayColor='#99d9f4'>*/}
                    {/*<Text style={styles.buttonText}>Save</Text>*/}
                {/*</TouchableHighlight>*/}
                <Button onPress={() => this.onPress()}>添加题目</Button>
            </View>
        );
    }
}

module.exports = NewOneQuestion;