/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class AnswerQuestion extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>AnswerQuestion</Text>

            </View>
        );
    }
}

module.exports = AnswerQuestion;