/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
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
            code:0
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
                    alert(responseData.message);

                }else{
                    this.setState({
                        registerresult:responseData.message
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer} >
                <GiftedForm
                    keyboardShouldPersistTaps="always"
                    formName='registerForm'
                    clearOnClose={false}

                    defaults={{
                        username: 'sunnyhu',
                        password: 'sunnyhu',
                        passwordagain:'sunnyhu',
                        emailAddress:'sunnyhu@qq.com',
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
                                arguments: [6, 255],

                            },{
                                validator: 'isEmail',
                            }]
                        },

                    }}
                >
                    <GiftedForm.TextInputWidget
                        name='username'
                        title='Username'
                        placeholder='fantexi'
                        clearButtonMode='while-editing'
                    />

                    <GiftedForm.TextInputWidget
                        name='password' // mandatory
                        title='Password'
                        placeholder='******'
                        clearButtonMode='while-editing'
                        secureTextEntry={true}
                    />

                    <GiftedForm.TextInputWidget
                        name='passwordagain' // mandatory
                        title='Confirm'
                        placeholder='******'
                        clearButtonMode='while-editing'
                        secureTextEntry={true}
                    />

                    <GiftedForm.TextInputWidget
                        name='emailaddress' // mandatory
                        title='Email address'
                        placeholder='example@qq.com'

                        keyboardType='email-address'

                        clearButtonMode='while-editing'

                    />
                    <GiftedForm.ErrorsWidget />
                    <GiftedForm.SubmitWidget
                        title='Sign up'
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
                                if(values.password == values.passwordagain){
                                   this._doregister(values.username,values.password,values.emailaddress);
                                    postSubmit();
                                }else{
                                    postSubmit('go check passwordagain');
                                }

                                //GiftedFormManager.reset('registerForm');
                            }
                        }}

                    />

                    <GiftedForm.NoticeWidget
                        title='you agree to the Terms of Service and Privacy Policity. 11'
                    />

                    <GiftedForm.HiddenWidget name='tos' value={true} />

                </GiftedForm>
                <Text>{this.state.registerresult}</Text>
            </View>
        );
    }
}

module.exports = Register;