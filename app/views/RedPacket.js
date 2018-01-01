/**
 * Created by slako on 18/01/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class RedPacket extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text>{this.props.name}</Text>
                <Text>{this.props.idnumber}</Text>
                <Button onPress={Actions.pop}>Help</Button>
            </View>
        );
    }
}

RedPacket.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = RedPacket;
