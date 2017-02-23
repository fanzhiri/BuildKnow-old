/**
 * Created by slako on 17/2/18.
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

class Me extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>Me</Text>
                <Button onPress={Actions.pop}>Me</Button>
                <Button onPress={() => Actions.setting()}>设置</Button>
                <Button onPress={() => Actions.homepage()}>我的主页</Button>
                <Button onPress={() => Actions.answerquestion()}>回答问题</Button>
            </View>
        );
    }
}

module.exports = Me;