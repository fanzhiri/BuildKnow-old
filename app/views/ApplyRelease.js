/**
 * Created by slako on 17/5/4.
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

var askforreleaseUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=applyreleasebook";


class ApplyRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptiontext:"我要发布"
        };

    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        你准备发布{this.props.bookid}需要发送审核申请，等批准通过
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
        formData.append("askforreleasebookid",this.props.bookid);
        formData.append("msg",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(askforreleaseUrl,opts)
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

ApplyRelease.PropTypes = {
    bookId: PropTypes.number.isRequired,
};

module.exports = ApplyRelease;