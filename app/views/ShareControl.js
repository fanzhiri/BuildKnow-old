/**
 * Created by slako on 17/4/30.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ScrollView,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
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
    },
    buttonviewcontainer:{
        flex: 1,
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
        height:60,
    },
    submitbutton:{
        marginLeft:32,
        marginRight:32,
        height:40,
        backgroundColor: '#00EE00'
    }
});
var sharecontrolUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=sharecontrol";



class ShareControl extends Component {

    constructor(props) {
        super(props);

        this.state = {
            controldata:null,
            code:0,
            selectvalue:this.props.sharetype,

        };

    }

    dosubmitshare(){
        if(this.state.selectvalue == this.props.sharetype){
            return;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookId);
        formData.append("sharewayid",this.state.selectvalue);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sharecontrolUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){
                    alert("ok");
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    showcontrol(){

        return (
            <ScrollView >
                {this.showcontrolItem("私密不分享",0)}
                {this.showcontrolItem("分享到关注",1)}
                {this.showcontrolItem("分享到所有",2)}
                {this.showcontrolItem("分享到好友",3)}
                {this.showcontrolItem("分享到指定",4)}
                <View style={styles.buttonviewcontainer}>
                    <Button style={styles.submitbutton} textStyle={{fontSize: 16}} onPress={() => this.dosubmitshare()}>提交修改</Button>
                </View>

            </ScrollView>
        )
    }

    onSelectChange(idx) {
        this.setState({
            selectvalue: idx,
        });
    }

    rendertake(idx){

        if(idx == this.props.sharetype){
            iconColor ="#00FF00";
        }else if(this.state.selectvalue == idx ){
            iconColor ="#FF0000";
        }else {
            return;
        }

        return(
            <View style={styles.IconItem}>
                <Icon name={"md-checkmark-circle"} size={22} color={iconColor}/>
            </View>
        )
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
    sharetype: PropTypes.number.isRequired,
};

module.exports = ShareControl;