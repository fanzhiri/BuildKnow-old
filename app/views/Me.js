/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import {storageSave,storeageGet} from '../util/NativeStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Me extends Component {

    constructor(props) {
        super(props);

        this.state = {
            auth:"fan",
        };

        this._showAuth = this.showAuth.bind(this);
        this._savemyAuth = this.savemyAuth.bind(this);
    }

    showAuth(){

    }

    savemyAuth(){

    }
    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Button onPress={() => Actions.setting()}>设置</Button>
                <Button onPress={() => Actions.homepage()}>我的主页</Button>
                <Button onPress={() => Actions.mybooklist()}>我的题本</Button>
                <Button onPress={() => this._savemyAuth()}>save auth</Button>
                <Button onPress={() => this._showAuth()}>show auth</Button>
            </View>
        );
    }
}

module.exports = Me;