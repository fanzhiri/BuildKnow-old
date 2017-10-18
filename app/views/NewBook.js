/**
 * Created by slako on 17/05/23.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

//import ImagePicker from "react-native-image-picker";
import TcombForm from "tcomb-form-native";
import ImagePicker from 'react-native-image-crop-picker';
var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        margin:6
    },
    nameinput:{

        fontSize:16,
        marginTop:6,
        height: 32,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    imgcontainer:{
        flex:1,
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
        marginTop:10,
        marginLeft:10,
        width:80,
        height:80,

    },
    rightImgStyle:{
        marginTop:10,
        marginLeft:10,
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
            uploading:0,
            bookcover8080_size:0,
            bookcover18080_size:0,
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
        if(this.state.uploading == 1){
            return;
        }
        this.setState({
            uploading:1,
        });
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
        let img_width =80;
        if(what == 2){
            img_width =180;
        }
        ImagePicker.openPicker({
            width: img_width,
            height: 80,
            cropping: true
        }).then(image => {
            //alert(image.sourceURL);
            console.log(image.size);
            if(what == 1 ){
                let source = { uri: image.sourceURL , width: 80, height: 80 };
                this.setState({
                    coverSource8080: source,
                    bookcover8080_size:Math.ceil(image.size/1024)
                });
            }else{
                let source = { uri: image.sourceURL , width: 180, height: 80 };
                this.setState({
                    coverSource18080: source,
                    bookcover18080_size:Math.ceil(image.size/1024)
                });
            }
        });
    }

    newbook(){
        if(this.state.name ===""){
            alert("需填写名字");
            return;
        }
        if(this.state.brief ===""){
            alert("需填写简介");
            return;
        }
        if(this.state.descriptioninput ===""){
            alert("需填写描述");
            return;
        }
        this.docommit();

    }

    render(){
        let buttontext = this.state.uploading ==0 ?"添加题本":"添加中";
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <ScrollView>
                    <TextInput
                        style={styles.nameinput}
                        onChangeText={(text) => this.setState({name:text})}
                        value={this.state.name}
                        placeholder={"名字：请添写最多12字"}
                        maxLength={12}
                        multiline={false}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({brief:text})}
                        value={this.state.brief}
                        placeholder={"简介：请添写最多32字"}
                        maxLength={32}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({description:text})}
                        value={this.state.description}
                        placeholder={"描述：请添写最多100字"}
                        maxLength={100}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <Text style={{marginTop:10}}>图标：图片大小 {this.state.bookcover8080_size} k</Text>
                    <TouchableOpacity onPress={()=>this._onSelectCoverPress(1)} >
                        <Image source={this.state.coverSource8080} style={styles.leftImgStyle} />
                    </TouchableOpacity>
                    <Text style={{marginTop:10}}>海报：图片大小 {this.state.bookcover18080_size} k</Text>
                    <TouchableOpacity onPress={()=>this._onSelectCoverPress(2)} >
                        <Image source={this.state.coverSource18080} style={styles.rightImgStyle} />
                    </TouchableOpacity>

                </ScrollView>


                <View style={{flex:1,justifyContent:"flex-end"}}>
                    <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.newbook()} >
                        <Text style={{fontSize: 18}}>{buttontext}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

module.exports = NewBook;