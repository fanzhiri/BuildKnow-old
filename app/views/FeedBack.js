/**
 * Created by slako on 17/5/11.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,TextInput,Image,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "apsl-react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    descriptioninput:{
        marginLeft:20,
        marginRight:20,
        marginTop:10,
        height: 160,
        borderColor: 'gray',
        borderWidth: 2
    },
    fromhint:{
        marginLeft:20,
        marginTop:30,
        fontSize: 24,
    },button:{
        width:160,
        height:48,
        backgroundColor: '#00EE00'
    },buttonContainer:{
        marginLeft:20,
        marginTop:40,
        justifyContent: 'center',
        alignItems: 'center',
    },imgContainer:{
        marginRight:6,
    },allImgContainer:{
        marginLeft:20,
        marginTop:10,
        flexDirection:'row',
    },

});

var askforreleaseUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=applyreleasebook";


class FeedBack extends Component {
    constructor(props) {
        super(props);
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            descriptiontext:"请添写10个字以上的问题描述以便更好地帮助你",
            coverSource: addcoveruri,
        };

    }

    onSelectPicPress(){
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

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        问题与意见
                    </Text>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({descriptiontext:text})}
                        value={this.state.descriptiontext}
                        placeholder={"请添写10个字以上的问题描述以便更好地帮助你"}
                        maxLength={200}
                        multiline={true}
                    />
                    <Text style={styles.fromhint}>
                        图片(问题截图等、选填)
                    </Text>
                    <View style={styles.allImgContainer}>
                        <TouchableOpacity onPress={()=>this.onSelectPicPress()} >
                            <Image style={styles.imgContainer} source={this.state.coverSource}  />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onSelectPicPress()} >
                            <Image style={styles.imgContainer} source={this.state.coverSource}  />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onSelectPicPress()} >
                            <Image style={styles.imgContainer} source={this.state.coverSource}  />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onSelectPicPress()} >
                            <Image style={styles.imgContainer} source={this.state.coverSource}  />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} textStyle={{fontSize: 18}} onPress={() => this.fetchcommit() }>提交</Button>
                    </View>

                </View>
            </View>
        );
    }

    askforfriend(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askforreleasebookid",this.props.bookid);
        formData.append("msg",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(askforreleaseUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok")
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }
}

module.exports = FeedBack;