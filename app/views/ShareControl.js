/**
 * Created by slako on 17/4/30.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';
import SettingItem from '../component/SettingItem'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 12
    },

    labeltext:{
        fontSize:24

    }
});
var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=member&c=personal&a=sharecontrol";

var control_radio_props = [
    {label: '私密不分享', value: 0 },
    {label: '分享到关注', value: 1 },
    {label: '分享到好友', value: 2 },
    {label: '分享到指定', value: 3 }
];

class ShareControl extends Component {

    constructor(props) {
        super(props);

        this.state = {
            controldata:null,
            code:0,
            selectvalue:-1,

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

    submitcontrol(){


    }

    showcontrol(){

        return (
            <View >
                <RadioForm

                    radio_props={control_radio_props}
                    initial={-1}
                    onPress={(value) => {this.setState({selectvalue:value})}}
                />
                <Button onPress={() => this.submitcontrol()}>提交修改</Button>
            </View>
        )
    }

    rendercontrol(){
        if(this.state.controldata == null){

            //this._dofetchquestion(qid);

            //return this._renderloading();
            return this.showcontrol();
        }else{
            return this.showcontrol();
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.rendercontrol()}

            </View>
        );
    }

    renderloading(){
        return (
            <View style={styles.container}>
                <Text>Loading ...</Text>
            </View>
        )
    }
}

ShareControl.PropTypes = {
    bookId: PropTypes.string.isRequired,
};

module.exports = ShareControl;