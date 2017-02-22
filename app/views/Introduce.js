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

        backgroundColor: '#F5FCFF',
    },

});

class Introduce extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>Introduce</Text>
                <Button onPress={Actions.pop}>Setting</Button>
                <Button onPress={() => Actions.help()}>帮助</Button>
            </View>
        );
    }
}

module.exports = Introduce;