/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    question:{
        fontSize:24
    }
});
var init_radio_props = [
    {label: 'param1', value: 0 },
    {label: 'param2', value: 1 },
    {label: 'param3', value: 2 },
    {label: 'param4', value: 3 }
];

class AnswerQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            radio:init_radio_props
        };
    }
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text style={styles.question}>please AnswerQuestion</Text>
                <RadioForm
                    radio_props={this.state.radio}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}
                />
            </View>
        );
    }
}

module.exports = AnswerQuestion;