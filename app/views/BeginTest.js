/**
 * Created by slako on 17/4/30.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,Dimensions,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import Button from 'apsl-react-native-button'

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },beginButton:{
        width:window.width,
        backgroundColor: '#00EE00'
    },
    textdesc:{
        fontSize:20
    },
    buttonContainer:{
        flex: 1,
        justifyContent: 'flex-end',
    }

});

class BeginTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bookquestion_data_source:null,
        };
    }

    fetch_bookquestion(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookdata.question_book_id);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyBookQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        bookquestion_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    rendercommontest(){
        return(
            <ScrollView>
                <Text style={styles.textdesc}>名字：{this.props.bookdata.bookname}</Text>
                <Text style={styles.textdesc}>题数：{this.props.bookdata.q_count}</Text>
                <Text style={styles.textdesc}>限定题数：</Text>
                <Text style={styles.textdesc}>限定时间：</Text>
                <View style={styles.buttonContainer}>
                    <Button style={styles.beginButton} textStyle={{fontSize: 18}} onPress={ () => Actions.answerquestion()}>
                        开始测验
                    </Button>
                </View>
            </ScrollView>
        )
    }

    goingtopktest(){
        let t_questiondataarr = JSON.parse(this.props.pkdata.questionsready);
        for(let i=0;i < this.props.pkdata.testnum;i++){
            let rightindex = Math.floor(Math.random() * 4);

        }

        Actions.answerquestion();
    }

    renderpktest(){
        let pkpeople = JSON.parse(this.props.pkdata.people);
        return(
            <ScrollView>
                <Text style={styles.textdesc}>名字：{this.props.pkdata.bookname}</Text>
                <Text style={styles.textdesc}>题数：{this.props.pkdata.testnum}</Text>

                <Text style={styles.textdesc}>限定时长：</Text>
                <Text style={styles.textdesc}>参与人数：{pkpeople.length}</Text>
                <Text style={styles.textdesc}>截止时间：{this.props.pkdata.overdue}</Text>
                <View style={styles.buttonContainer}>
                    <Button style={styles.beginButton} textStyle={{fontSize: 18}} onPress={ () =>this.goingtopktest()}>
                        开始测验
                    </Button>
                </View>
            </ScrollView>
        )
    }

    renderbegin(){
        switch (parseInt(this.props.intype)){
            case 0:
                return this.rendercommontest();
                break;
            case 1:
                return this.renderpktest();
                break;
            default:
                break;
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderbegin()}
            </View>
        );
    }
}

BeginTest.PropTypes = {
    intype:PropTypes.number,// 0普通测试 1:pk邀请
    bookdata: PropTypes.object,
    pkdata:PropTypes.object
};

module.exports = BeginTest;