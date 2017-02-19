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

class HomePage extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>HomePage</Text>
                <Button onPress={Actions.pop}>HomePage</Button>
            </View>
        );
    }
}

module.exports = HomePage;