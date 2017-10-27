/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from "react-native";
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
    abouttext:{
        fontSize:20,
        margin:6
    }
});

class About extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={styles.container}>
                    <Text style={styles.abouttext}>Version 1.1</Text>
                    <Text style={styles.abouttext}>bringup : slakofan</Text>
                    <Text style={styles.abouttext}>Phone 13246715168</Text>
                    <Text style={styles.abouttext}>Email 48921093@qq.com</Text>
                    <TouchableOpacity  onPress={()=>(Actions.donate())} >
                        <Text>捐赠</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

module.exports = About;