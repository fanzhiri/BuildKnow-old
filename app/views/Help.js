/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,ScrollView} from "react-native";
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

class Help extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ScrollView>
                    <View style={styles.list}>
                        <SettingItem text={"广告合作"} onPress={() => Actions.gitbookshow({shownumber:2})}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

Help.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = Help;
