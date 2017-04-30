/**
 * Created by slako on 17/3/28.
 * 组建题本
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet, SegmentedControlIOS, ListView, TouchableOpacity} from "react-native";

import Button from "react-native-button";
import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import BookIntroduce from './BookIntroduce'
import BookDiscuss from './BookDiscuss'
import BookHistory from './BookHistory'
import DataStore from '../util/DataStore';
import GlobleStyles from '../styles/GlobleStyles';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        marginTop:10,
        marginLeft:10,
        flexDirection:'row',
        height:80,
    },
    container2: {
        flex: 3,
    },

    image:{
        flex:1,
        width:80,

        borderRadius:16,
    },
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    },
    list:{
        marginBottom:20
    },
    questionitem:{
        marginTop:8,
        marginLeft:8
    }
});

var doGetMyBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybookquestion";

class ComposeBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookquestion_data_source:null,
            selectedIndex:0,
        };
        this._onChange = this._onChange.bind(this);
        this._handlePress = this._handlePress.bind(this);
        this._renderQuestionItem = this.renderQuestionItem.bind(this);

    }

    dofetch_mybookquestion(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("bookid",this.props.bookid);
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

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    _handlePress(event) {

    }

    render(){
        const {bookid} = this.props;
        global.composeBookid=bookid;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <Button onPress={() => Actions.newonequestion({bookid})}>添加题目</Button>
                    <Button onPress={() => Actions.newsomequestions({bookid})}>批量添加</Button>
                    <Button onPress={() => Actions.sharecontrol({bookid})}>分享控制</Button>
                </View>
                <View>
                    <SegmentedControlIOS
                        values={['题目','发布','历史']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}

            </View>
        );
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {
            return (
                this.renderQuestionView()
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderDiscussView()
            )
        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderHistoryView()
            )
        }
    }

    renderQuestionView(){
        if(this.state.bookquestion_data_source == null){
            this.dofetch_mybookquestion();
            return (this.renderLoading())
        }else{
            return (this.renderQuestionListView())
        }

    }

    renderQuestionItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        return (
            <View>
                <Text style={styles.questionitem}>
                    {rowID}:{ask.substring(0,24)}
                </Text>

            </View>


        )
    }

    renderQuestionListView(){
        return (


                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.bookquestion_data_source)}
                    renderRow={(rowData, sectionID, rowID) => this._renderQuestionItem(rowData, sectionID, rowID)}
                    enableEmptySections = {true}
                />


        )
    }

    renderDiscussView(){
        const {bookid} = this.props;
        return (
            <Text>Discuss</Text>
        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }
}

ComposeBook.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = ComposeBook;