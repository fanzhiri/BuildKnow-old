/**
 * Created by slako on 17/4/30.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ScrollView,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';
import SettingItem from '../component/SettingItem'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 12
    },

    labeltext:{
        fontSize:24

    },
    listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    }
});
var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=member&c=personal&a=sharecontrol";



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
            <ScrollView >
                {this.showcontrolItem("私密不分享",0)}
                {this.showcontrolItem("分享到关注",1)}
                {this.showcontrolItem("分享到好友",2)}
                {this.showcontrolItem("分享到指定",3)}
                <Button onPress={() => this.submitcontrol()}>提交修改</Button>
            </ScrollView>
        )
    }

    onSelectChange(idx) {
        this.setState({
            selectvalue: idx,
        });
    }

    rendertake(idx){
        var iconColor ="#FF0000";
        if(this.state.selectvalue==idx){
            return(
                <View style={styles.IconItem}>
                    <Icon name={"md-checkmark-circle"} size={22} color={iconColor}/>
                </View>
            )
        }

    }

    showcontrolItem(text,idx){

        return(
            <TouchableOpacity onPress={() => this.onSelectChange(idx)} activeOpacity={0.8}>
                <View style={styles.listItem}>

                    <Text style={{color: '#FF0000', fontSize: 16}}>{text}：</Text>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        {this.rendertake(idx)}
                    </View>

                </View>
            </TouchableOpacity>
        );
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