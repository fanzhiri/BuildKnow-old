/**
 * Created by slako on 17/12/18.
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

class UserAgreement extends Component {

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

UserAgreement.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = UserAgreement;
