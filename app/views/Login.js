/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
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

});

var dologinpostUrl = "https://slako.applinzi.com/index.php?m=question&c=api&a=login";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginresult:"no"
        };
        this._dologin = this.dologin.bind(this)
    }

    dologin(){
        let formData = new FormData();
        formData.append("username","fanzhiri");
        formData.append("password","123456");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(dologinpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.message =="success"){
                    this.setState({
                        loginresult:"ok"
                    })
                    Actions.main();
                }else{
                    this.setState({
                        loginresult:responseData.message
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>{this.state.loginresult}</Text>
                <Button onPress={this._dologin}>登录</Button>
                {/*<Button onPress={()=> Actions.main()}>登录</Button>*/}
                <Button onPress={()=> Actions.register()}>注册</Button>
                <Button onPress={()=> Actions.introduce()}>介绍</Button>
            </View>
        );
    }
}

module.exports = Login;