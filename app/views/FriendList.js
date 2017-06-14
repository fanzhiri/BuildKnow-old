/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper'
import GlobleStyles from '../styles/GlobleStyles';
import FoldView from 'react-native-foldview';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop:64,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
});

class FriendList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        };
    }
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

            </View>
        );
    }
}

FriendList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择

};

module.exports = FriendList;