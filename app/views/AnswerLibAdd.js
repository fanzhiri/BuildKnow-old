/**
 * Created by slako on 17/12/04.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,Alert} from "react-native";
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

var doCommitNewAnswerLibPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addanswerlib";

class AnswerLibAdd extends Component {

    constructor() {

        super();

        this.state = {

            name:"",
            brief:"",
            uploading:0,
        };


    }


    docommit(){
        if(this.state.uploading == 1){
            return;
        }
        this.setState({
            uploading:1,
        });
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("name",this.state.name);
        formData.append("brief",this.state.brief);

        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewAnswerLibPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop({refresh:{gorefresh:1}});
                    Alert.alert('操作提示','新建成功',[
                        {text:'去刚才创建的答案群',onPress:()=>Actions.answerlibedit({answerlibdata:responseData.data})},{text:'返回'}
                    ]);
                }else{
                    alert(responseData.message);
                    this.setState({
                        uploading:0,
                    });
                }

            })
            .catch((error) => {
                alert(error);
                this.setState({
                    uploading:0,
                });
            })
    }

    newanswerlib(){
        if(this.state.name ===""){
            alert("需填写名字");
            return;
        }
        if(this.state.brief ===""){
            alert("需填写简介");
            return;
        }

        this.docommit();

    }

    render(){
        let buttontext = this.state.uploading ==0 ?"添加答案群":"添加中";
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
                </ScrollView>


                <View style={{flex:1,justifyContent:"flex-end"}}>
                    <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.newanswerlib()} >
                        <Text style={{fontSize: 18}}>{buttontext}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

module.exports = AnswerLibAdd;