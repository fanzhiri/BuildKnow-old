/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet,Alert, SegmentedControlIOS} from "react-native";

import Button from 'apsl-react-native-button'

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

import GlobleStyles from '../styles/GlobleStyles';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        margin:10,
        flexDirection:'row',
        height:80,
        marginBottom:0,
    },
    container2: {
        marginLeft:10,
    },
    container3: {
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        height:24,
        marginRight:10,
    },
    image:{
        width:80,
        height:80,
        borderRadius:16,
    },
    segmented:{
        marginTop:8,
        width:240,
        alignSelf:'center'
    },
    obtainButton:{
        width:38,height:24,
        backgroundColor: '#00FF7F',
    },
    dropButton:{
        width:38,height:24,
        backgroundColor: '#FF0000',
    },
    nameText:{
        fontSize: 20,
    },
    briefText:{
        marginTop:8,
        fontSize: 14,
    },
    textmargin:{
        marginTop:10,
    }
});

var httpsBaseUrl = "https://slako.applinzi.com/";


var bookcollectchangeUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=bookcollectchange";
var getpublicbookUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getpublicbook";

class BookCover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            bookdata:null,
            collectit:false
        };
        this._onChange = this._onChange.bind(this);

    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    docollect(collectitornot){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("publishbookid",this.state.bookdata.reviewid);
        formData.append("collect",collectitornot);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(bookcollectchangeUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.bookcollect=JSON.parse(responseData.data);
                    this.setState({
                        collectit:global.bookcollect.contains(this.state.bookdata.reviewid)
                    })
                }else{
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dogetpublicbook(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("publishbookid",this.props.bookpublicid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getpublicbookUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        bookdata:responseData.data
                    })
                }else{
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    godropbook(){
        Alert.alert('慎重操作','真的要丢弃这本书吗?',[
            {text:'是的',onPress:()=> this.docollect(0)},
            {text:'不了'}
        ]);
    }

    rendercollectbutton(){

        if(global.bookcollect.contains(this.state.bookdata.reviewid)){
            return(
                <View style={styles.container3}>
                    <Button style={styles.dropButton} textStyle={{fontSize: 12}}  onPress={() => this.godropbook()}>丢弃</Button>
                    <Button style={styles.dropButton} textStyle={{fontSize: 12}}  onPress={() => Actions.buildingbook({bookid:this.state.bookdata.bookid})}>进入</Button>
                </View>
            );
        }else{
            return(
                <View style={styles.container3}>
                    <Button style={styles.obtainButton} textStyle={{fontSize: 12}}  onPress={() => this.docollect(1)}>收藏</Button>
                </View>
            );
        }

    }


    render(){
        return (
                this.renderBookView()
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderBookView(){
        if(this.state.bookdata == null){
            this.dogetpublicbook();
            return (this.renderLoading())
        }else{
            return (this.renderBook())
        }
    }

    renderBook(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={{uri:`${httpsBaseUrl}${this.state.bookdata.cover}`}} />
                    </View>
                    <View style={styles.container2}>
                        <Text style={styles.nameText}>{this.state.bookdata.bookname}</Text>
                        <Text style={styles.briefText}>{this.state.bookdata.bookbrief}</Text>
                    </View>
                </View>
                {this.rendercollectbutton()}

                <View>
                    <SegmentedControlIOS
                        values={['介绍','评论','历史']}
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
                this.renderIntroduceView()
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

    renderIntroduceView(){
        return (
            <View>
                <Text style={styles.textmargin}>题目数量 :{this.state.bookdata.questioncount}</Text>
                <Text style={styles.textmargin}>题本简介 :{this.state.bookdata.bookbrief}</Text>
                <Text style={styles.textmargin}>题本详情 :{this.state.bookdata.bookdescription}</Text>
                <Text style={styles.textmargin}>题目编号 :{this.state.bookdata.qids}</Text>
                <Text style={styles.textmargin}>关注人数 :{this.state.bookdata.follow}</Text>
            </View>
        )
    }

    renderDiscussView(){
        return (
            <Text>Discuss</Text>
        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
    }
}

BookCover.PropTypes = {
    bookpublicid: PropTypes.number,
};

Array.prototype.contains = function (element) {
    for (var i=0;i<this.length;i++){
        if(this[i]==element){
            return true;
        }
    }
    return false;
}

module.exports = BookCover;