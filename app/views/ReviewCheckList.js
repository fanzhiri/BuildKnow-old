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

import LoadingData from '../component/LoadingData';
import EmptyData from '../component/EmptyData';


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
var doauditpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=setaudit";
var httpsBaseUrl = "https://slako.applinzi.com/";

class ReviewCheckList extends Component {

    constructor(props) {
        super(props);

        let getcheck_arr = new Array(3);
        for(let i=0;i<3;i++){
            getcheck_arr[i] = 0;
        }
        this.state = {
            netresult:'no',
            question_audit_list_data_source: null,
            selectedIndex:0,
            getcheck:getcheck_arr
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
                let t_getcheck = this.state.getcheck;
                t_getcheck[audit]=1;

                if(responseData.code == 100){
                    //alert(responseData.data);

                    this.setState({
                        question_audit_list_data_source:responseData.data,
                        getcheck:t_getcheck
                    })
                }else{
                    this.setState({
                        getcheck:t_getcheck
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }


    renderCheckList(){

        if (this.state.question_audit_list_data_source) {
            return (this.renderCheckListView())
        } else {
            if(this.state.getcheck[this.state.selectedIndex] == 0){
                this.fetchQuestionlist(this.state.selectedIndex);
                return (<LoadingData/>)
            }else{
                return(<EmptyData/>)
            }

        }

    }

    onChange(event) {
        let t_getcheck = this.state.getcheck;
        t_getcheck[event.nativeEvent.selectedSegmentIndex]=0;
        this.setState({
            question_audit_list_data_source:null,
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
            getcheck:t_getcheck
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

    allpass(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("reviewid",this.props.reviewid);
        formData.append("audit",4);


        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doauditpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderButton(){
        switch (this.state.selectedIndex){
            case 0:
                return(
                    <TouchableOpacity onPress={() => this.allpass()}>
                        <View style={{height:32,borderRadius:6,margin:4,backgroundColor:"#00EE00",justifyContent:"center",alignItems:"center"}}>
                            <Text>全部通过</Text>
                        </View>
                    </TouchableOpacity>
                );
                break


        }
        return;
    }

    renderCheckListView(){
        return (
            <View>
                {this.renderButton()}
                <ListView
                    enableEmptySections={true}
                    dataSource={DataStore.cloneWithRows(this.state.question_audit_list_data_source)}
                    renderRow={this._renderRow} />
            </View>
        )
    }

}

ReviewCheckList.PropTypes = {
    reviewid:PropTypes.number,
};


module.exports = ReviewCheckList;