/**
 * Created by slako on 17/4/30.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
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

class BeginTest extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>TestResult</Text>
                <Button onPress={Actions.pop}>Help</Button>
            </View>
        );
    }
}

module.exports = BeginTest;