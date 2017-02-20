/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, Image, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {

        flexDirection:'row',
        height:80,
    },
    container2: {
        flex: 3,
    },

    image:{
        flex:1,
        width:80,

        borderRadius:16,
    },
});

class BookDiscuss extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>BookDiscuss</Text>

            </View>
        );
    }
}

module.exports = BookDiscuss;