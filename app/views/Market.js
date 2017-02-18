/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
});

class Market extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Swiper height={240} loop={true} autoplay={true}>
                    <View style={styles.slide}>
                        <Text> abc </Text>
                    </View>
                    <View style={styles.slide}>
                        <Text> def </Text>
                    </View>
                    <View style={styles.slide}>
                        <Text> ghi </Text>
                    </View>
                </Swiper>
                <Button onPress={Actions.pop}>Market</Button>
            </View>
        );
    }
}

module.exports = Market;