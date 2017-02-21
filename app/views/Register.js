/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import TcombForm from "tcomb-form-native";

var Form = TcombForm.form.Form;

var Person = TcombForm.struct({
    name: TcombForm.String,              // a required string
    surname: TcombForm.maybe(TcombForm.String),  // an optional string
    age: TcombForm.Number,               // a required number
    rememberMe: TcombForm.Boolean        // a boolean
});

var options = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Register extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer} >

                <Form
                    ref="form"
                    type={Person}
                    options={options}
                />
                <Button onPress={Actions.pop}>Register</Button>
            </View>
        );
    }
}

module.exports = Register;