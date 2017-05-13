/**
 * Created by slako on 17/5/13.
 */

import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, Image, SegmentedControlIOS, Dimensions, TouchableOpacity,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobleStyles from '../styles/GlobleStyles';
import TestingItem from '../component/TestingItem';
import DataStore from '../util/DataStore';


const window = Dimensions.get('window');
const STICKY_HEADER_HEIGHT = 32;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    segmented:{
        marginTop:6,
        marginBottom:6,
        width:240,
        alignSelf:'center'
    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#FF0000',
        fontSize: 20
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
    },
    bottomButtonViewContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        height: 32,
        alignItems: 'center',
    },
    bottomButtonText: {
        fontSize: 16,
    },
    topViewContainer:{
        height: 200,

    },
    topImgView:{
        //position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItem:{
        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
    image: {
        width: 60,
        height: 60,
    },bottomTextContainer: {

        height: 60,
        justifyContent: 'space-around',
        marginLeft: 10,
        width:window.width-140,
    },titleText: {
        fontSize: 20,
        justifyContent: 'center',
    },
    bottomText: {
        fontSize: 12,
        justifyContent: 'center',
        width:window.width-100,
    },leftbutton:{
        width:36,
        justifyContent:'space-around',
        marginRight:4,
        marginLeft:4,
        alignItems: 'center',
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
});

var reviewQuestionsUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getauditquestions";
/*
var doReviewBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=reviewbook";
var doPassBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=passbook";
var doRejectBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=rejectbook";

*/
var httpsBaseUrl = "https://slako.applinzi.com/";

class ReviewCheckList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            netresult:'no',
            question_audit_list_data_source: null,

            selectedIndex:0,
        };
        this._onChange = this.onChange.bind(this);
        this._renderRow = this.renderRow.bind(this);
    }


    fetchQuestionlist(audit){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("audit",audit);
        formData.append("reviewid",this.props.reviewid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(reviewQuestionsUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    //alert(responseData.data);
                    this.setState({
                        question_audit_list_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }


    renderCheckList(){
        if (this.state.selectedIndex === 0) {
            if (this.state.question_audit_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchQuestionlist(0);
                return (this.renderLoading())
            }
        }else if (this.state.selectedIndex === 1) {
            if (this.state.question_audit_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchQuestionlist(1);
                return (this.renderLoading())
            }
        }else if (this.state.selectedIndex === 2) {
            if (this.state.question_audit_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchQuestionlist(2);
                return (this.renderLoading())
            }
        }
    }

    onChange(event) {
        this.setState({
            question_audit_list_data_source:null,
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        const {userId} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['未核','核完','拒绝']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderCheckList()}
            </View>

        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    fetchpass(bookid){
        this.fetchgroup(bookid, doPassBookUrl);
    }
    fetchreject(bookid){
        this.fetchgroup(bookid, doRejectBooksUrl);
    }
    fetchbeginreview(bookid) {
        this.fetchgroup(bookid, doReviewBookUrl);
    }

    fetchgroup(bookid,url){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("bookid",bookid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    //alert(bookid);
                    this.setState({
                        book_list_data_source:null,
                    });
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderControlButton(bookstatus,bookid){
        if(bookstatus == 1){
            return(
                <View style={styles.leftbutton}>
                    <TouchableOpacity onPress={() => this.fetchbeginreview(bookid)}>
                        <Text >开始审核</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(bookstatus == 2){
            return(
                <View style={styles.leftbutton}>
                    <TouchableOpacity onPress={() => this.fetchpass(bookid)}>
                        <Text >通过</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.fetchreject(bookid)}>
                        <Text >拒绝</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }



    renderRow(rowData, sectionID, rowID) {
        var ask = (rowData.ask);
        var qId = (rowData.questionid);
        return (
            <TouchableOpacity onPress={() => Actions.reviewquestion({reviewqid:qId})}>
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {rowID} :[{qId}] {ask.substring(0,20)}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }

    renderBookListView(){
        return (
            <ListView
                enableEmptySections={true}
                dataSource={DataStore.cloneWithRows(this.state.question_audit_list_data_source)}
                renderRow={this._renderRow} />

        )
    }


}

ReviewCheckList.PropTypes = {
    reviewid:PropTypes.number,
};


module.exports = ReviewCheckList;