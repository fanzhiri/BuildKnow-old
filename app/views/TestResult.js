/**
 * Created by slako on 17/4/30.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

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
        fontSize:24,
        marginTop:12
    },
    buttonContainer:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    saveContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
    },
    saveButton:{
        width:100,
        backgroundColor: '#00EE00'
    },

});

class TestResult extends Component {

    dropResult(){
        Actions.pop({popNum:2});//把做题界面也退出了
    }
    saveResult(){
        Actions.pop({popNum:2});//把做题界面也退出了
    }
    saveAndShare(){
        Actions.pop({popNum:2});//把做题界面也退出了
    }
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Text style={styles.textdesc}>本名：{this.props.bookname}</Text>
                <Text style={styles.textdesc}>题数：{this.props.testnum}</Text>
                <Text style={styles.textdesc}>分数：{this.props.score}</Text>
                <Text style={styles.textdesc}>分数：{this.props.score}</Text>
                <Text style={styles.textdesc}>耗时：{this.props.score} 分钟</Text>
                <Text style={styles.textdesc}>对题：{this.props.rightnum}  错题：{this.props.wrongnum}  </Text>
                <View style={styles.buttonContainer}>
                    <Button style={styles.beginButton} textStyle={{fontSize: 16}} onPress={ () => this.dropResult()}>
                        查看错题
                    </Button>
                    <View style={styles.saveContainer}>
                        <Button style={styles.saveButton} textStyle={{fontSize: 16}} onPress={ () => this.dropResult()}>
                            丢弃
                        </Button>
                        <Button style={styles.saveButton} textStyle={{fontSize: 16}} onPress={ () => this.saveResult()}>
                            保存
                        </Button>
                        <Button style={styles.saveButton} textStyle={{fontSize: 16}} onPress={ () => this.saveAndShare()}>
                            保存并分享
                        </Button>
                    </View>

                </View>
            </View>
        );
    }
}

TestResult.PropTypes = {
    intype:PropTypes.number,          //0正在建的题本测试 1已经发布的
    bookid: PropTypes.number,
    bookname: PropTypes.string,
    testnum: PropTypes.number,
    score: PropTypes.number,
    rightnum: PropTypes.number,
    wrongnum: PropTypes.number,
    taketime: PropTypes.number,
};

module.exports = TestResult;