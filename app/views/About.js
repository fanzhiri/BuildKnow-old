/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,TouchableOpacity,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    abouttext:{
        fontSize:16,
        margin:4
    }
});

class About extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={styles.container}>
                    <Text style={styles.abouttext}>版本 1.1</Text>
                    <Text style={styles.abouttext}>创始人: slakofan</Text>
                    <Text style={styles.abouttext}>邮箱: 48921093@qq.com</Text>
                    <TouchableOpacity  onPress={()=>(Actions.donate())} >
                        <View style={{margin:12,height:24,width:48,justifyContent: 'center',alignItems: 'center',borderRadius:6,backgroundColor:"#00FF00"}}>
                            <Text>捐赠</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <ScrollView>
                    <SettingItem text={"用户协议"} onPress={() => Actions.useragreement()}/>
                    <SettingItem text={"隐私政策"} onPress={() => Actions.about()}/>
                </ScrollView>
            </View>
        );
    }
}

module.exports = About;