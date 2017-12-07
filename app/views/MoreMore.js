/**
 * Created by slako on 17/12/07.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';
import SettingItem from '../component/SettingItem'

const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 12
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});
var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=member&c=index&a=logout";

class MoreMore extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logoutresult:'no',
            code:0
        }
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
                <ScrollView>
                    <View style={styles.list}>
                        <SettingItem text={"我的组织"} onPress={() => Actions.organizelist()}/>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

module.exports = MoreMore;