/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,TextInput,Alert,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    emailinput:{
        marginLeft:18,
        marginRight:18,
        marginBottom:18,
        marginTop:40,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:8
    }
});

var doResetPasswdPostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=reset_passwd";

class ForgetPasswd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailtext:""
        };

    }

    sendemail(){
        let formData = new FormData();

        formData.append("email",this.state.emailtext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doResetPasswdPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Alert.alert('重设密码','已经发邮件到你的邮箱',[
                        {text:'好的'}
                    ]);
                }else{

                    Alert.alert('重设密码','邮箱地址不存在',[
                        {text:'好的'}
                    ]);
                    //alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>

                    <TextInput
                        style={styles.emailinput}
                        onChangeText={(text) => this.setState({emailtext:text})}
                        value={this.state.emailtext}
                        placeholder={"邮件地址"}
                    />

                    <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#00FF00",justifyContent:"center",alignItems:"center"}} onPress={() => this.sendemail()} >
                        <Text style={{fontSize: 18}}>发送修改到您的邮件</Text>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }
}

module.exports = ForgetPasswd;