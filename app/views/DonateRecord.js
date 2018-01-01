/**
 * Created by slako on 17/12/05.
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

var doCommitDonatePostUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=donaterecord";

class DonateRecord extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            name:"",
            money:1,
            words:"",
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
        formData.append("money",this.state.money);
        formData.append("words",this.state.words);

        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitDonatePostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        uploading:0,
                    });
                    Alert.alert('操作提示','添加成功',[
                        {text:'ok'}
                    ]);
                }else{
                    alert(global.auth);
                    alert(responseData.message)
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



    commitcheck(){
        if(this.state.name ===""){
            alert("需填写名字");
            return;
        }
        if(this.state.money === 0){
            alert("需填写金额");
            return;
        }
        if(this.state.words ===""){
            alert("需填写赠言");
            return;
        }
        this.docommit();

    }

    moneychange(text){
        let moneyint = 0;
        if(text ==""){

        }else{
            moneyint = parseInt(text);
        }
        this.setState({money:moneyint})
    }

    render(){
        let buttontext = this.state.uploading ==0 ?"添加捐助人":"添加中";
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
                        keyboardType ={"numeric"}
                        onChangeText={(text) => this.moneychange(text)}
                        value={this.state.money.toString()}
                        placeholder={"金额：1 ~ 10000"}
                        maxLength={5}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({words:text})}
                        value={this.state.words}
                        placeholder={"赠言：请添写最多32字"}
                        maxLength={32}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                </ScrollView>

                <View style={{flex:1,justifyContent:"flex-end"}}>
                    <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.commitcheck()} >
                        <Text style={{fontSize: 18}}>{buttontext}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

module.exports = DonateRecord;