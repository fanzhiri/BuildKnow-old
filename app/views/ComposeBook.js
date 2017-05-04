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
import SettingItem from '../component/SettingItem'

import Dialog from "react-native-dialog";

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
        marginTop:20
    },
    questionitemcontainer:{

        padding:5,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#ab82ff',
    },
    questionitem:{
        marginTop:8,
        marginLeft:8,
        fontSize: 16,
    },
    questioneditcontainer:{
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection:'row',
        borderTopWidth:0.5,
        borderLeftWidth:0.5,
        borderRightWidth:0.5,
        borderBottomWidth:0.5,
        borderBottomColor:'#9acd32',
        marginTop:8,
        marginBottom:8,
        padding:4,
    },
    questionedittext:{
        fontSize: 14,
        borderLeftWidth:0.5,
        borderRightWidth:0.5,
        borderBottomColor:'#9acd32',
        color:'#CD2626'
    },
    sharecontrolcontainer:{
        height:32,
        borderTopColor:'#9acd32',
        borderBottomColor:'#9acd32',
        borderTopWidth:0.5,
        borderBottomWidth:0.5,
        flexDirection:'row',
        alignItems:'center',
        marginLeft:10,
    },
    sharecontrolcontainer2:{
        flex: 1,
        height:32,
        justifyContent: 'flex-end',
        alignItems:'center',
        flexDirection:'row',
        marginRight:10,
    },
    sharecontroltext:{
        fontSize: 14,
    },
});

var doGetMyBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybookquestion";

var doDeleteQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=deletequestion";


class ComposeBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookquestion_data_source:null,
            selectedIndex:0,
            selectedQuestion:-1,
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

    dofetch_deletequestion(id){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("questionid",id);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doDeleteQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.dofetch_mybookquestion();
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

    deletebook(){

    }

    render(){
        const {bookid} = this.props;
        global.composeBookid=bookid;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <View>
                    <Button onPress={() => Actions.newonequestion({bookid})}>添加题目</Button>
                    <Button onPress={() => Actions.newsomequestions({bookid})}>批量添加</Button>
                    <Button onPress={() => this.deletebook({bookid})}>删除题本</Button>
                    <Button onPress={() => this.deletebook({bookid})}>修改题本</Button>
                    <View  style={styles.sharecontrolcontainer}>
                        <Text style={styles.sharecontroltext} >分享方式</Text>
                        <View style={styles.sharecontrolcontainer2}>
                            {/*<Button onPress={() => Actions.sharecontrol({bookid})}>私密</Button>*/}
                            <TouchableOpacity onPress={() => Actions.sharecontrol({bookid})}>
                                <Text>私密</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

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
    selectquestion(index){
        this.setState({
            selectedQuestion:index
        });
    }

    deletequestion(id){
        this.dofetch_deletequestion(id);
    }

    checkquestion(id){
        //this.dofetch_deletequestion(id);
    }

    renderEditView(index,qId){
        if(index == this.state.selectedQuestion){
            return (
                <View style={styles.questioneditcontainer}>

                    <TouchableOpacity  onPress={()=> this.checkquestion(qId)} >
                        <Text style={styles.questionedittext} >查看</Text>
                    </TouchableOpacity>
                    <Text style={styles.questionedittext} >编辑</Text>
                    <TouchableOpacity  onPress={()=> this.deletequestion(qId)} >
                        <Text style={styles.questionedittext} >删除</Text>
                    </TouchableOpacity>
                </View>

            )
        }
    }

    renderQuestionItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        var qId = (rowData.questionid);
        return (
            <TouchableOpacity onPress={() => this.selectquestion(rowID)}>
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {rowID} : {ask.substring(0,20)}
                    </Text>
                    {this.renderEditView(rowID,qId)}
                </View>
            </TouchableOpacity>

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

    applyforrelease(bookid){
        Actions.applyrelease(bookid);
    }

    renderDiscussView(){
        const {bookid} = this.props;
        return (
            <TouchableOpacity onPress={() => this.applyforrelease(bookid)}>
                <Text>发布申请</Text>
            </TouchableOpacity>
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