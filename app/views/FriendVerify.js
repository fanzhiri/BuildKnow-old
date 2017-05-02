/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
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
    descriptioninput:{
        marginLeft:20,
        marginRight:20,
        marginBottom:20,
        marginTop:20,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    fromhint:{
        marginTop:40,
    }

});

class FriendVerify extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        你需要发送验证申请，等对方通过
                    </Text>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({emailtext:text})}
                        value={this.state.emailtext}
                        placeholder={"  描述你自己"}
                    />
                    <Button onPress={() => this.sendemail()}>发送验证申请</Button>
                </View>
            </View>
        );
    }
}

FriendVerify.PropTypes = {
    userId: PropTypes.string.isRequired,
};

module.exports = FriendVerify;