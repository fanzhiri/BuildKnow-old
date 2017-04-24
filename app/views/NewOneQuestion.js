/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,TouchableHighlight,PropTypes} from 'react';
import {View, Text,Image, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import TcombForm from "tcomb-form-native";
import ImagePicker from "react-native-image-picker";

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
        let addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };
        this.state = {
            imgSource: addimguri,
        };

        this._onSelectImgPress = this.onSelectImgPress.bind(this)
    }

    docommit(newquestion){
        const {bookid} = this.props;
        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: 'pic.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",bookid);
        formData.append("ask",newquestion.ask);
        formData.append("right_answer",newquestion.rightanswer);
        formData.append("wrong_answer_1",newquestion.wronganswier1);
        formData.append("wrong_answer_2",newquestion.wronganswier2);
        formData.append("wrong_answer_3",newquestion.wronganswier3);
        formData.append("pic320240",file);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
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

    onSelectImgPress(){
        var options = {
            title: 'Select Img',

            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri , width: 100, height: 68 };
                //alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    imgSource: source
                });
            }
        });

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
                <TouchableOpacity onPress={()=>this._onSelectImgPress()} >
                    <Image source={this.state.imgSource}  />
                </TouchableOpacity>
                <Button onPress={() => this.onPress()}>为{bookid}添加题目</Button>
            </View>
        );
    }
}

NewOneQuestion.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = NewOneQuestion;