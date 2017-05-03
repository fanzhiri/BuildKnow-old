/**
 * Created by slako on 17/5/3.
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

var docomplaintUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=complaint";


class Complaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptiontext:""
        };

    }

    render(){
        const {userId} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Text style={styles.fromhint}>
                        你需要填写投诉原因
                    </Text>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({descriptiontext:text})}
                        value={this.state.descriptiontext}
                        placeholder={"  描述投诉事项"}
                    />
                    <Button onPress={() => this.askforcomplaint()}>提交申请</Button>
                </View>
            </View>
        );
    }

    askforcomplaint(){
        const {userId} = this.props;

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askforcomplaintid",userId);
        formData.append("msg",this.state.descriptiontext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(docomplaintUrl,opts)
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

Complaint.PropTypes = {
    userId: PropTypes.string.isRequired,
};

module.exports = Complaint;