/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,TextInput} from "react-native";
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
        borderWidth: 1
    }
});

class ForgetPasswd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailtext:null
        };

    }

    sendemail(){

    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>

                    <TextInput
                        style={styles.emailinput}
                        onChangeText={(text) => this.setState({emailtext:text})}
                        value={this.state.emailtext}
                        placeholder={"  邮件地址"}
                    />
                    <Button onPress={() => this.sendemail()}>发送密码修改连接到您的邮件</Button>
                </View>


            </View>
        );
    }
}

module.exports = ForgetPasswd;