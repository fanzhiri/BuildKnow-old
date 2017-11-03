/**
 * Created by slako on 17/11/02.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    list:{
        marginBottom:0
    },
    listItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems: 'center',
    },
    rightViewStyle:{
        //主轴对齐方式
        justifyContent:'center'

    },
    leftImgStyle:{
        width:60,
        height:60,
        marginRight:15
    },
    topTitleStyle: {
        fontSize:16,
        marginBottom:10
    },statusText: {
        fontSize: 14,
        justifyContent: 'center',
        color: 'red',
    },
    numText: {
        fontSize: 20,
        marginRight:10,
        justifyContent: 'center',
        color: 'red',
    },
});

var doGetBookListUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=getallbooks";
var doGetSomeBookListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getsomebooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doCloneQstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=cloneqst";

class BookList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            books_data_source:null,
            get_bookdata:false,
            gorefreshing:false,
        };

        this._renderBookItem = this.renderBookItem.bind(this)
    }

    dofetch_booklist(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        if(this.props.classifyid != null){
            formData.append("classify",this.props.classifyid);
        }

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetSomeBookListUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        books_data_source:responseData.data,
                        get_bookdata:true
                    })
                }else{
                    this.setState({
                        get_bookdata:true
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_CloneQst(bookid){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",bookid);
        formData.append("qstid",this.props.qstid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doCloneQstUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Actions.pop();
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderMyBooksView(){
        if(this.state.books_data_source == null){
            if(this.state.get_bookdata){
                return(<EmptyData/>)
            }else{
                this.dofetch_booklist();
                return (<LoadingData/>)
            }

        }else{
            return (this.renderMyBooks())
        }
    }

    renderReviewing(status){

        if(status == 1){
            return(
                <View >
                    <Text style={styles.statusText}>等待审核中</Text>
                </View>
            )
        }else{
            return null;
        }
    }

    onItemPress(rowData){
        if(this.props.inmode == 0){
            Actions.bookcover({bookpublicid:rowData.reviewid,title:rowData.bookname})
        }else if(this.props.inmode == 1){
            if(this.props.intype == 1){
                this.dofetch_CloneQst(rowData.question_book_id);
            }else{
                Actions.pop();
            }
        }
    }

    renderBookItem(rowData, sectionID, rowID){
        var cover = rowData.cover;
        return (
            <TouchableOpacity onPress={() => this.onItemPress(rowData)}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <Image source={{uri:`${httpsBaseUrl}${cover}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.bookname}
                        </Text>
                        {this.renderReviewing(rowData.status)}
                        <Text >
                            {rowData.bookbrief}
                        </Text>
                        <Text >
                            题数:{rowData.q_count}  关注:{rowData.follow}  分享:{rowData.share}  评论:{10}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderMyBooks(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_booklist()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.books_data_source)}
                renderRow={this._renderBookItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderMyBooksView()}
            </View>
        );
    }


}

BookList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number,//1 克隆
    whose:PropTypes.number,//0个人  1 所有
    qstid:PropTypes.number,
    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,
    classifyid:PropTypes.number,
};
/*
* 用途：管理员查看所有书目
* */

module.exports = BookList;