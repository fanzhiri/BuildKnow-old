/**
 * Created by slako on 17/5/4.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,TextInput,PickerIOS,Alert,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

var PickerItemIOS = PickerIOS.Item;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    descriptioninput:{
        marginLeft:20,
        marginRight:20,
        marginBottom:20,
        marginTop:20,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:6
    },
    fromhint:{
        marginLeft:20,
        marginTop:40,
        fontSize: 18,
    }

});

var askforreleaseUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=applyreleasebook";

var checkBeforeApplyUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkapply";

/*
var NUMBER_PICK_ITEM=['0','100','1000','10000','100000'];
<Text>面向的人数</Text>
<PickerIOS
selectedValue={this.state.numberpeopleselect}
onValueChange={(nindex)=> this.setState({
    numberpeopleselect:nindex
})}
>
{
    Object.keys(NUMBER_PICK_ITEM).map((nindex)=>(
            <PickerItemIOS
                key={nindex}
                value={nindex}
                label={NUMBER_PICK_ITEM[nindex]}
            />
        )
    )
}
</PickerIOS>
*/

class ApplyRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptiontext:"我要发布",
            numberpeopleselect:0,
            checkresult:0
        };

    }

    checkApply(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(checkBeforeApplyUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        checkresult:1,
                    });
                    Alert.alert('检测提示','检测通过',[
                        {text:'好的'}
                    ]);
                }else{
                    let error_text =null;
                    switch (responseData.code){
                        case 201:error_text="请先设置海报";break;
                        case 202:error_text="题目数量少于10";break;
                        case 203:error_text="请选择类型";break;
                    }
                    Alert.alert('检测提示',error_text,[
                        {text:'好的'}
                    ]);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderVerify(){
        return(
            <TouchableOpacity onPress={() => this.checkApply()}>
                <View style={{height:32,borderRadius:6,margin:4,backgroundColor:"#A0BF00",justifyContent:"center",alignItems:"center"}}>
                    <Text>初步校验</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderApplySubmit(){
        if(this.state.checkresult != 1){
            return;
        }
        return(
            <View>
                <Text style={styles.fromhint}>
                    你准备发布{this.props.bookid}，需要发送审核申请，等批准通过
                </Text>
                <TextInput
                    style={styles.descriptioninput}
                    onChangeText={(text) => this.setState({descriptiontext:text})}
                    value={this.state.descriptiontext}
                    placeholder={"  描述你自己"}
                />

                <Button onPress={() => this.askforfriend()}>发送验证申请</Button>
            </View>
        )
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderVerify()}
                {this.renderApplySubmit()}
            </View>
        );
    }

    askforfriend(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askforreleasebookid",this.props.bookid);
        formData.append("msg",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(askforreleaseUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Alert.alert('申请提示','等待审核',[
                        {text:'好的'}
                    ]);
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }
}

ApplyRelease.PropTypes = {
    bookId: PropTypes.number.isRequired,
};

module.exports = ApplyRelease;