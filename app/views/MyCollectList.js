/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity} from "react-native";
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
});

var doGetMyCollectBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmycollectbooks";
var httpsBaseUrl = "https://slako.applinzi.com/";

class MyCollectBookList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            books_data_source: null,
        };

        this._renderBookItem = this.renderBookItem.bind(this)
    }

    dofetch_mycollectbooks(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyCollectBooksUrl,opts)
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

    renderMyBooksView(){
        if(this.state.books_data_source ==null){
            this.dofetch_mycollectbooks();
            return (this.renderLoading())
        }else{
            return (this.renderMyBooks())
        }
    }


    renderBookItem(book){
        var cover = (book.cover);
        var bookid= (book.bookid);
        return (
            <TouchableOpacity onPress={() => Actions.bookcover({bookpublicid:book.reviewid})}>
                <View style={styles.listItem}>
                    <Image source={{uri:`${httpsBaseUrl}${cover}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {book.bookname}
                        </Text>

                        <Text >
                            {book.bookbrief}
                        </Text>
                        <Text >
                            题数:{book.questioncount}  收藏:  评论:{10}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderMyBooks(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.books_data_source)}
                renderRow={(rowData) => this._renderBookItem(rowData)}
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

module.exports = MyCollectBookList;