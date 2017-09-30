/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';


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

var doGetMyBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doCloneQstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=cloneqst";

class MyBookList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            books_data_source: null,
            gorefreshing:false,
        };

        this._renderBookItem = this.renderBookItem.bind(this)
    }

    dofetch_mybooks(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyBooksUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        books_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
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
        if(this.state.books_data_source ==null){
            this.dofetch_mybooks();
            return (this.renderLoading())
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
            Actions.composebook({bookid:rowData.question_book_id,title:rowData.bookname})
        }else if(this.props.inmode == 1){
            if(this.props.intype == 1){
                dofetch_CloneQst(rowData.question_book_id);
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
                        onRefresh={() => this.dofetch_mybooks()}
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
                {/*<Button onPress={() => Actions.newbook()}>添加题本</Button>*/}
                {this.renderMyBooksView()}
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
}

MyBookList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number,//1 克隆
    qstid:PropTypes.number,
    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,
};


module.exports = MyBookList;