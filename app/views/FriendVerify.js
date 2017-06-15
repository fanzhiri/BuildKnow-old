/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,TextInput} from "react-native";
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
        marginLeft:20,
        marginTop:40,
        fontSize: 18,
    }

});

var askforfriendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addfriend";


class FriendVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptiontext:"我是"
        };

    }

    render(){
        const {userId} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        你需要发送验证申请，等对方通过
                    </Text>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({descriptiontext:text})}
                        value={this.state.descriptiontext}
                        placeholder={"  描述你自己"}
                    />
                    <Button onPress={() => this.askforfriend()}>发送验证申请</Button>
                </View>
            </View>
        );
    }

    askforfriend(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askforfriendid",this.props.userId);
        formData.append("msg",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(askforfriendUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok")
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }
}

FriendVerify.PropTypes = {
    userId: PropTypes.string.isRequired,
};

module.exports = FriendVerify;