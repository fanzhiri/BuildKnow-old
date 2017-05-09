/**
 * Created by slako on 17/4/30.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import Button from 'apsl-react-native-button'

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },beginButton:{
        width:window.width-40,
        backgroundColor: '#00EE00'
    }

});

class BeginTest extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>题数：</Text>
                <Button style={styles.beginButton} textStyle={{fontSize: 18}} onPress={ () => Actions.answerquestion()}>
                    开始
                </Button>
            </View>
        );
    }
}

module.exports = BeginTest;