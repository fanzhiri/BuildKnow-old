/**
 * Created by slako on 17/11/09.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TextInput,TouchableOpacity} from "react-native";
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
    passwdtitle:{
        marginTop:16,
        marginLeft:10
    },
    passwdinput:{

        fontSize:16,
        marginTop:6,
        height: 32,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        marginLeft:10,
        marginRight:10
    },
});


var doChangepwdUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=changepwdinapp";

class ChangePasswd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            old_passwd:'',
            new_passwd:'',
            new_passwd_2:''

        };
    }

    gochangepasswd(){
        if(this.state.new_passwd == ''){
            return;
        }
        if(this.state.new_passwd_2 == ''){
            return;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("username",global.username);
        formData.append("oldpassword",this.state.old_passwd);
        formData.append("newpassword",this.state.new_passwd);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doChangepwdUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok");
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text style={styles.passwdtitle}>旧密码</Text>
                <TextInput
                    style={styles.passwdinput}
                    onChangeText={(text) => this.setState({old_passwd:text})}
                    value={this.state.old_passwd}
                    maxLength={20}
                    multiline={false}
                    returnKeyType={'done'}
                />
                <Text style={styles.passwdtitle}>新密码</Text>
                <TextInput
                    style={styles.passwdinput}
                    onChangeText={(text) => this.setState({new_passwd:text})}
                    value={this.state.new_passwd}

                    maxLength={20}
                    multiline={false}
                    returnKeyType={'done'}
                />
                <Text style={styles.passwdtitle}>确认密码</Text>
                <TextInput
                    style={styles.passwdinput}
                    onChangeText={(text) => this.setState({new_passwd_2:text})}
                    value={this.state.new_passwd_2}
                    maxLength={20}
                    multiline={false}
                    returnKeyType={'done'}
                />
                <TouchableOpacity style={{margin:20,borderRadius:8,height:32,
                    backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.gochangepasswd()} >
                    <Text style={{fontSize: 18}}>确定</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ChangePasswd.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = ChangePasswd;
