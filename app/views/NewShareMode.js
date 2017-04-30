/**
 * Created by slako on 17/4/28.
 */
import React, { Component ,TouchableHighlight,PropTypes} from 'react';
import {View, Text,Image, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import ImagePicker from "react-native-image-picker";
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
//名字
//有效期
//密码
//白名单
//黑名单
var NewQuestion = TcombForm.struct({
    name: TcombForm.String,
    time: TcombForm.String,
    passwd: TcombForm.String,
    white: TcombForm.String,
    black: TcombForm.String,
});

var options = {};

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addshareway";

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };


class NewShareMode extends Component {

    constructor(props) {

        super(props);
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

        var opts =null;
        if(this.state.imgSource == addimguri){
            //formData.append("pic320240",file);
            opts = {
                method:"POST",
                body:formData
            }
        }else{
            formData.append("pic320240",file);
            opts = {
                method:"POST",
                headers:{
                    'Content-Type':'multipart/form-data',
                },
                body:formData
            }
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

                <Button onPress={() => this.onPress()}>添加分享方式</Button>
            </View>
        );
    }
}

NewShareMode.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = NewShareMode;