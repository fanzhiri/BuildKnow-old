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

class About extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={styles.container}>
                    <Text>CEO slakofan</Text>
                    <Text>Phone 13246715168</Text>
                    <Text>Email 48921093@qq.com</Text>
                </View>
            </View>
        );
    }
}

module.exports = About;