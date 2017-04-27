/**
 * Created by slako on 17/4/27.
 */
import React, { Component } from 'react';
import {View, Text, Image,StyleSheet,TouchableOpacity} from "react-native";
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
    headimage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
    },
});

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=headpic";

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg" , width: 200, height: 200};


class SetHeadPic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imgSource: null,
        };

        this._onSelectImgPress = this.onSelectImgPress.bind(this)
    }

    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: 'pic.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);

        var opts =null;

        formData.append("headpic",file);
        opts = {
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
                    //alert(global.auth);
                    //alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
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
                let source = { uri: response.uri , width: 200, height: 200 };
                //alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    imgSource: source
                });
            }
        });

    }

    onPress(){
        if(this.state.imgSource == addimguri){
            return;
        }
        this.docommit();

    }

    render(){
        if(this.state.imgSource == null){
            this._onSelectImgPress();
        }

        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <Button onPress={() => this.onPress()}>上传</Button>
                <TouchableOpacity style={styles.container} onPress={() => this._onSelectImgPress()}>
                    {this.state.imgSource?
                        <Image style={styles.headimage} resizeMode="cover"
                               source={this.state.imgSource}
                               ></Image>
                        :
                        <Image style={styles.headimage} resizeMode="cover"
                               source={addimguri}
                               ></Image>
                    }

                </TouchableOpacity>

            </View>
        );
    }
}

module.exports = SetHeadPic;