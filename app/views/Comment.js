/**
 * Created by slako on 17/9/20.
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

var doCommentUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=comment";


class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commenttext:"",
            upload:0
        };

    }

    render(){
        const {userId} = this.props;

        let buttonText = "发送";
        if(this.state.upload == 1){
            buttonText = "发送中...";
        }
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({commenttext:text})}
                        value={this.state.commenttext}
                        placeholder={"写评论..."}
                        maxLength={96}
                        returnKeyType={'done'}
                    />
                    <Button onPress={() => this.sendComment()}>{buttonText}</Button>
                </View>
            </View>
        );
    }

    sendComment(){
        if(this.state.upload == 1){
            return;
        }
        const {userId} = this.props;

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("nickname",global.nickname);
        formData.append("commenttype",this.props.intype);
        formData.append("commentid",this.props.commentid);
        formData.append("comment",this.state.commenttext);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doCommentUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        upload:0
                    });
                    Actions.pop();
                }else{
                    this.setState({
                        netresult:responseData.code,
                        upload:0
                    })
                    alert("网络不通")
                }

            })
            .catch((error) => {
                alert(error)
            })
    }
}

Comment.PropTypes = {
    intype:PropTypes.number,//0评论发布的，1评论未发布的，2评论题目
    commentid:PropTypes.number
};

module.exports = Comment;