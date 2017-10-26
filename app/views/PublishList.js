/**
 * Created by slako on 17/10/25.
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
    }
});

var doPendingReleaseBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getpendingreleasebook";
var doReviewBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=reviewbook";
var doPassBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=passbook";
var doRejectBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=rejectbook";


var httpsBaseUrl = "https://slako.applinzi.com/";

class PublishList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            netresult:'no',
            book_list_data_source: null,
            book_reviewing_list_data_source: null,
            selectedIndex:0,
        };
        this._onChange = this.onChange.bind(this);
        this._renderRow = this.renderRow.bind(this);
    }


    fetchBooklist(status){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("status",status);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doPendingReleaseBooksUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        book_list_data_source:responseData.data
                    })
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }


    renderBookList(){
        if (this.state.selectedIndex === 0) {
            if (this.state.book_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchBooklist(1);
                return (this.renderLoading())
            }
        }else if (this.state.selectedIndex === 1) {
            if (this.state.book_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchBooklist(2);
                return (this.renderLoading())
            }
        }else if (this.state.selectedIndex === 2) {
            if (this.state.book_list_data_source) {
                return (this.renderBookListView())
            } else {
                this.fetchBooklist(3);
                return (this.renderLoading())
            }
        }
    }

    onChange(event) {
        this.setState({
            book_list_data_source:null,
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        const {userId} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['等待','审核中','审完']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderBookList()}
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

    fetchpass(reviewid){
        this.fetchgroup(reviewid, doPassBookUrl);
    }
    fetchreject(reviewid){
        this.fetchgroup(reviewid, doRejectBooksUrl);
    }
    fetchbeginreview(reviewid) {
        this.fetchgroup(reviewid, doReviewBookUrl);
    }

    fetchgroup(reviewid,url){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("reviewid",reviewid);
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
                }else if(responseData.code == 201){
                    alert("没有审核完");
                    //alert(responseData.data);
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderControlButton(bookstatus,reviewid){
        if(bookstatus == 1){
            return(
                <View style={styles.leftbutton}>
                    <TouchableOpacity onPress={() => this.fetchbeginreview(reviewid)}>
                        <Text >开始审核</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(bookstatus == 2){
            return(
                <View style={styles.leftbutton}>
                    <TouchableOpacity onPress={() => this.fetchpass(reviewid)}>
                        <Text >通过</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.fetchreject(reviewid)}>
                        <Text >拒绝</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    renderRow(rowData, sectionID, rowID) {
        var bookid =rowData.bookid;
        var cover = rowData.cover;
        var name =rowData.bookname;
        var bookbrief =rowData.bookbrief;
        var questionsnumber =rowData.q_count;
        var follow =rowData.follow;
        var bookstatus =rowData.status;
        var reviewid =rowData.reviewid;
        return (
            <TouchableOpacity  onPress={()=>(Actions.reviewchecklist({reviewid}))} >
                <View style={styles.listItem}>
                    <Image style={styles.image} resizeMode="cover" source={{uri:`${httpsBaseUrl}${cover}`}}/>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.titleText}>{name}</Text>
                        <Text style={styles.bottomText}>审核id:{reviewid}</Text>
                        <Text style={styles.bottomText}>题数:{questionsnumber} 关注:{follow} </Text>
                    </View>
                    {this.renderControlButton(bookstatus,reviewid)}
                </View>
            </TouchableOpacity>
        );

    }

    renderBookListView(){
        return (
            <ListView
                enableEmptySections={true}
                dataSource={DataStore.cloneWithRows(this.state.book_list_data_source)}
                renderRow={this._renderRow} />

        )
    }


}

PublishList.PropTypes = {
    userId: PropTypes.string,
};


module.exports = PublishList;