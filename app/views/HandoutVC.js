/**
 * Created by slako on 18/01/01.
 */
import React, { Component ,PropTypes} from 'react';
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

var doHandoutVCPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=handoutvc";

class HandoutVC extends Component {

    constructor() {

        super();

        this.state = {
            remainmoney:global.money,
            name:"",
            money:0,
            words:"恭喜发财",
            uploading:0,
            cansend:true
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
        formData.append("conversationid",this.props.cvst_id);
        formData.append("money",this.state.money);
        formData.append("words",this.state.words);

        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doHandoutVCPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        uploading:0,
                        remainmoney:responseData.data
                    });
                    global.money = responseData.data;
                    Actions.pop({refresh:{gorefresh:1}});
                }else{
                    alert(global.auth);
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



    commitcheck(){
        if(this.state.cansend == false){return;}
        if(this.state.money == 0){return;}
        this.docommit();
    }

    moneychange(text){
        let moneyint = 0;
        if(text ==""){

        }else{
            moneyint = parseInt(text);
        }
        if(this.state.remainmoney  < moneyint){
            this.setState({
                money:moneyint,
                cansend:false
            });
        }else{
            this.setState({
                money:moneyint,
                cansend:true
            });
        }

    }

    renderCommitButton(){
        let buttontext = null;
        let buttonColor = "#FF0F00";
        if(this.state.cansend == true){
            buttontext = this.state.uploading == 0 ?"塞建识币进红包":"正在发出";
        }else{
            buttontext = "没那么多币";
            buttonColor = "#CCCCCC";
        }
        if(this.state.money > 0){
            return(
                <TouchableOpacity style={{margin:4,borderRadius:8,height:38,
                        backgroundColor:buttonColor,justifyContent:"center",alignItems:"center"}} onPress={() => this.commitcheck()} >
                    <Text style={{fontSize: 18}}>{buttontext}</Text>
                </TouchableOpacity>
            )
        }else{
            return(
                <View style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#FFB5C5",justifyContent:"center",alignItems:"center"}}  >
                    <Text style={{fontSize: 18}}>{buttontext}</Text>
                </View>
            )
        }
    }

    render(){

        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <ScrollView>
                    <View style={{height:32,margin:8}}>
                        <Text style={{fontSize:20}}>余币：{this.state.remainmoney}</Text>
                    </View>
                    <TextInput
                        style={styles.briefinput}
                        keyboardType ={"numeric"}
                        onChangeText={(text) => this.moneychange(text)}
                        value={this.state.money.toString()}
                        placeholder={"币额："}
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
                    {this.renderCommitButton()}
                </View>

            </View>
        );
    }
}


HandoutVC.PropTypes = {
    cvst_id: PropTypes.number,//发送给会话所有人
};

module.exports = HandoutVC;