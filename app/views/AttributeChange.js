/**
 * Created by slako on 17/10/11.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,TextInput,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';

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
        paddingLeft:8,
        paddingRight:8
    },
    fromhint:{
        marginLeft:20,
        marginTop:40,
        fontSize: 18,
    }

});

var doSubmittUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=attributechange";


class AttributeChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptiontext:"",
            attribute:props.attribute==null?0:props.attribute
        };

    }

    render(){

        let changeText = "";
        let textmaxlength = 10;
        switch (this.state.attribute){
            case 1:changeText = "昵称";textmaxlength=8;
            break;
            case 2:changeText = "手机号";textmaxlength=16;
            break;
            case 3:changeText = "个性签名";textmaxlength=32;
            break;
        }
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        你正在更改【{changeText}】，最长:{textmaxlength}
                    </Text>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({descriptiontext:text})}
                        value={this.state.descriptiontext}
                        placeholder={changeText}
                        maxLength={textmaxlength}
                    />

                    <TouchableOpacity style={{height:36,margin:20,borderRadius:12,backgroundColor:"#00FF00",justifyContent:"center",alignItems:"center"}} onPress={() => this.submitchange()} >
                        <View >
                            <Text style={{fontSize: 16}}>提交修改</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    submitchange(){



        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("attribute",this.state.attribute);
        formData.append("text",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doSubmittUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    switch (this.state.attribute){
                        case 1:global.nickname=this.state.descriptiontext;
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }
                    alert("ok")
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

AttributeChange.PropTypes = {
    attribute: PropTypes.number.isRequired,//1昵称 2手机号 3个性签名
};

module.exports = AttributeChange;