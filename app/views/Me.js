/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";

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
            <View style={styles.container}>
                <Text>Me</Text>
                <Button onPress={Actions.pop}>Me</Button>
                <Button onPress={() => Actions.setting()}>设置</Button>
                <Button onPress={() => Actions.homepage()}>我的主页</Button>
            </View>
        );
    }
}

module.exports = Me;