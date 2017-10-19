/**
 * Created by slako on 17/4/27.
 */
import React, { Component } from 'react';
import {View, Text, Image,StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import ImagePicker from 'react-native-image-crop-picker';
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

//var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=headpic";
var docommitpostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachments&a=upload";
var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg" , width: 200, height: 200};


class SetHeadPic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imgSource: null,
            img_size:0,
            filename:null
        };

        this._onSelectImgPress = this.onSelectImgPress.bind(this)
    }

    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: this.state.filename};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("module","question");
        formData.append("what","head");
        var opts =null;

        formData.append("upload",file);
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
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onSelectImgPress(){
        /*
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
    */
        ImagePicker.openPicker({
            width: 80,
            height: 80,
            cropping: true
        }).then(image => {

            console.log(image.size);

            let source = { uri: image.sourceURL , width: 80, height: 80 };

            this.setState({
                imgSource: source,
                img_size:Math.ceil(image.size/1024),
                filename:image.filename
            });

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
                <Text>图片大小：{this.state.img_size}k</Text>
                <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                    backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.onPress()} >
                    <Text style={{fontSize: 18}}>上传</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

module.exports = SetHeadPic;