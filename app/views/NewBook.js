/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity} from "react-native";
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

});

var NewBookForm = TcombForm.struct({
    bookname: TcombForm.String,
    bookbrief: TcombForm.String,
    bookdescription: TcombForm.String,
});

var options = {};

var doCommitNewBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addbook";



class NewBook extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            coverSource: addcoveruri,
        };

        this._onSelectCoverPress = this.onSelectCoverPress.bind(this)
    }

    docommit(newbookdata){

        let formData = new FormData();
        let file = {uri: this.state.coverSource, type: 'multipart/form-data', name: 'bookcover8080.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookname",newbookdata.bookname);
        formData.append("bookbrief",newbookdata.bookbrief);
        formData.append("bookdescription",newbookdata.bookdescription);
        formData.append("bookcover8080",file);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewBookPostUrl,opts)
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

    onSelectCoverPress(){
        var options = {
            title: 'Select Cover',

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
                let source = { uri: response.uri , width: 80, height: 80 };
                //alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    coverSource: source
                });
            }
        });

    }

    onPress(){
        var value = this.refs.form.getValue();

        if (value != null) {
            this.docommit(value);
        }else{
            alert(" not finish set ");
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Tform
                    ref="form"
                    type={NewBookForm}
                    options={options}
                />
                <TouchableOpacity onPress={()=>this._onSelectCoverPress()} >
                    <Image source={this.state.coverSource}  />
                </TouchableOpacity>
                <Button onPress={() => this.onPress()}>添加题本</Button>
            </View>
        );
    }
}

module.exports = NewBook;