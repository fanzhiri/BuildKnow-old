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

class Follow extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>Follow</Text>
                <Button onPress={Actions.pop}>Follow</Button>
            </View>
        );
    }
}

module.exports = Follow;