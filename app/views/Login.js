/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Login extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Button onPress={()=> Actions.main()}>登录</Button>
                <Button onPress={()=> Actions.register()}>注册</Button>
            </View>
        );
    }
}

module.exports = Login;