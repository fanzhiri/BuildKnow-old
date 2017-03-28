/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});
var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=member&c=index&a=logout";

class Setting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logoutresult:'no',
            code:0
        };
        this._dologout = this.dologout.bind(this);
    }

    dologout(name,passwd){

        let formData = new FormData();
        formData.append("username",name);
        formData.append("password",passwd);
        formData.append("dosubmit","true");
        formData.append("api","true");
        formData.append("auth",global.auth);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(dologoutpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    code:responseData.code
                })
                if(responseData.code == 100){
                    this.setState({
                        logoutresult:"ok"
                    })
                    Actions.login();
                }else{
                    this.setState({
                        logoutresult:responseData.code
                    })
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>Setting</Text>
                <Button onPress={() => Actions.about()}>关于</Button>
                <Button onPress={() => Actions.help()}>帮助</Button>
                <Button onPress={() => (this._dologout())}>退出</Button>
            </View>
        );
    }
}

module.exports = Setting;