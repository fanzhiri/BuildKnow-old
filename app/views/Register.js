/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Alert,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import TcombForm from "tcomb-form-native";
import {GiftedForm, GiftedFormManager} from "react-native-gifted-form";


var Form = TcombForm.form.Form;

var Person = TcombForm.struct({
    name: TcombForm.String,              // a required string
    surname: TcombForm.maybe(TcombForm.String),  // an optional string
    age: TcombForm.Number,               // a required number
    rememberMe: TcombForm.Boolean        // a boolean
});

var doregisterpostUrl = "https://slako.applinzi.com/index.php?m=member&c=index&a=register";

var options = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            registerresult:"ready",
            code:0,
            checkright:0
        };
        this._doregister = this.doregister.bind(this);

    }

    doregister(name,passwd,email){
        let formData = new FormData();
        formData.append("username",name);
        formData.append("password",passwd);
        formData.append("email",email);
        formData.append("dosubmit","true");
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doregisterpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        registerresult:"ok"
                    })
                    //alert(responseData.message);
                    Alert.alert('注册提示','请等待管理员审核，等审核通过通知到您的邮箱，再登录',[
                        {text:'好的'}
                    ]);
                }else{
                    Alert.alert('注册提示',responseData.message,[
                        {text:'好的'}
                    ]);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){

        let buttontext = '注册';
        return (
            <View style={GlobleStyles.withoutTitleContainer} >
                <GiftedForm
                    keyboardShouldPersistTaps="always"
                    formName='registerForm'
                    clearOnClose={false}

                    defaults={{
                        username: 'buildquestion',
                        password: 'buildquestion',
                        passwordagain:'buildquestion',
                        emailaddress:'buildquestion@buildquestion.com',
                    }}
                    validators={{
                        username: {
                            title: 'Username',
                            validate: [{
                                validator: 'isLength',
                                arguments: [3, 16],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            },{
                                validator: 'matches',
                                arguments: /^[a-zA-Z0-9]*$/,
                                message: '{TITLE} can contains only alphanumeric characters'
                            }]
                        },
                        password: {
                            title: 'Password',
                            validate: [{
                                validator: 'isLength',
                                arguments: [6, 16],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            }]
                        },
                        passwordagain: {
                            title: 'Passwordagain',
                            validate: [{
                                validator: 'isLength',
                                arguments: [6, 16],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            }]
                        },
                        emailaddress: {
                            title: 'Email address',
                            validate: [{
                                validator: 'isLength',
                                arguments: [6, 60],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            },{
                                validator: 'isEmail',

                            }]
                        },

                    }}
                >
                    <GiftedForm.TextInputWidget
                        name='username'
                        title='用户名'
                        placeholder='用户名'
                        clearButtonMode='while-editing'
                    />

                    <GiftedForm.TextInputWidget
                        name='password' // mandatory
                        title='密码'
                        placeholder='密码'
                        clearButtonMode='while-editing'
                        secureTextEntry={true}
                    />

                    <GiftedForm.TextInputWidget
                        name='passwordagain' // mandatory
                        title='密码确认'
                        placeholder='密码确认'
                        clearButtonMode='while-editing'
                        secureTextEntry={true}
                    />

                    <GiftedForm.TextInputWidget
                        name='emailaddress' // mandatory
                        title='邮件地址'
                        placeholder='邮件地址'

                        keyboardType='email-address'

                        clearButtonMode='while-editing'

                    />
                    <GiftedForm.ErrorsWidget />

                    <View style={{height:42,justifyContent: 'center',flexDirection:"row",alignItems:"center",paddingLeft:4}}>
                        <Text>请确定您同意</Text>
                        <TouchableOpacity onPress={() => Actions.useragreement()} >
                            <View style={{height:24,justifyContent: 'center',alignItems: 'center',backgroundColor:"#00FFC1",borderRadius:6,marginLeft:4,marginRight:4,paddingRight:4,paddingLeft:4}}>
                                <Text style={{color:"#FF0000"}}>用户协议</Text>
                            </View>
                        </TouchableOpacity>
                        <Text>和</Text>
                        <TouchableOpacity onPress={() => Actions.useragreement()} >
                            <View style={{height:24,justifyContent: 'center',alignItems: 'center',backgroundColor:"#00FFC1",borderRadius:6,marginLeft:4,marginRight:4,paddingRight:4,paddingLeft:4}}>
                                <Text style={{color:"#FF0000"}}>隐私政策</Text>
                            </View>
                        </TouchableOpacity>
                        <Text>再点击注册</Text>
                    </View>


                    <GiftedForm.SubmitWidget
                        title={buttontext}
                        widgetStyles={{
                            submitButton: {
                                backgroundColor: '#FF00dd',
                            }
                        }}
                        onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                            if (isValid === true) {
                                // prepare object

                                /* Implement the request to your server using values variable
                                 ** then you can do:
                                 ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                                 ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                                 ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                                 */

                                //postSubmit('An error occurred, please try again');
                                //postSubmit();
                                if(values.password == ''){

                                    //postSubmit(['密码不能为空']);
                                }else if(values.password == values.passwordagain){
                                   this._doregister(values.username,values.password,values.emailaddress);
                                    postSubmit();
                                }else{
                                    postSubmit(['两次密码不一致']);
                                }


                            }
                            //GiftedFormManager.reset('registerForm');
                        }}

                    />

                    <GiftedForm.HiddenWidget name='tos' value={true} />

                </GiftedForm>

            </View>
        );
    }
}

module.exports = Register;