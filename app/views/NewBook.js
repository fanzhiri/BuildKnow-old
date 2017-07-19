/**
 * Created by slako on 17/05/23.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

import ImagePicker from "react-native-image-picker";
import TcombForm from "tcomb-form-native";

var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#BCEE68',
        margin:10
    },
    nameinput:{
        fontSize:16,
        marginTop:10,
        height: 32,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    imgcontainer:{
        width:360,
        marginTop:10,
        justifyContent: 'space-around',
        flexDirection:'row',
    },
    addbutton:{
        marginTop:10,
        height:48,
        backgroundColor: '#FFEE00'
    },
    leftImgStyle:{
        width:80,
        height:80,

    },
    rightImgStyle:{
        width:180,
        height:80,

    },
});

var doCommitNewBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addbook";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

class NewBook extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            coverSource8080: addcoveruri,
            coverSource18080: addcoveruri,
            name:"",
            brief:"",
            description:"",
            bookcover8080_id:null,
            bookcover18080_id:null,
        };

        this._onSelectCoverPress = this.onSelectCoverPress.bind(this)
    }

    commitpic(){
        let formData = new FormData();
        let file_8080 = {uri: this.state.coverSource8080, type: 'multipart/form-data', name: 'bookcover8080.jpg'};
        let file_18080 = {uri: this.state.coverSource18080, type: 'multipart/form-data', name: 'bookcover18080.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("upload",file_8080);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitPicPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        bookcover8080_id:responseData.data,
                    })
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    docommit(){

        let formData = new FormData();
        let file_8080 = {uri: this.state.coverSource8080, type: 'multipart/form-data', name: 'bookcover8080.jpg'};
        let file_18080 = {uri: this.state.coverSource18080, type: 'multipart/form-data', name: 'bookcover18080.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookname",this.state.name);
        formData.append("bookbrief",this.state.brief);
        formData.append("bookdescription",this.state.description);
        formData.append("bookcover8080",file_8080);
        formData.append("bookcover18080",file_18080);
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

    onSelectCoverPress(what){
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

                //alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                if(what == 1 ){
                    let source = { uri: response.uri , width: 80, height: 80 };
                    this.setState({
                        coverSource8080: source
                    });
                }else{
                    let source = { uri: response.uri , width: 180, height: 80 };
                    this.setState({
                        coverSource18080: source
                    });
                }

            }
        });

    }

    onPress(){
        if(this.state.name ===""){
            return;
        }
        if(this.state.brief ===""){
            return;
        }
        if(this.state.descriptioninput ===""){
            return;
        }
        this.docommit();

    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <TextInput
                    style={styles.nameinput}
                    onChangeText={(text) => this.setState({name:text})}
                    value={this.state.name}
                    placeholder={"名字：请添写最多12字"}
                    maxLength={12}
                    multiline={false}
                />
                <TextInput
                    style={styles.briefinput}
                    onChangeText={(text) => this.setState({brief:text})}
                    value={this.state.brief}
                    placeholder={"简介：请添写最多32字"}
                    maxLength={32}
                    multiline={true}
                />
                <TextInput
                    style={styles.descriptioninput}
                    onChangeText={(text) => this.setState({description:text})}
                    value={this.state.description}
                    placeholder={"描述：请添写最多100字"}
                    maxLength={100}
                    multiline={true}
                />
                <View  style={styles.imgcontainer}>
                    <TouchableOpacity onPress={()=>this._onSelectCoverPress(1)} >
                        <Image source={this.state.coverSource8080} style={styles.leftImgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this._onSelectCoverPress(2)} >
                        <Image source={this.state.coverSource18080} style={styles.rightImgStyle} />
                    </TouchableOpacity>
                </View>


                <Button style={styles.addbutton} textStyle={{fontSize: 20}} onPress={() => this.onPress()} >添加题本</Button>
            </View>
        );
    }
}

module.exports = NewBook;