/**
 * Created by slako on 17/9/27.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl,ScrollView} from "react-native";
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

class EditChapter extends Component {

    constructor(props) {

        super(props);

        this.state = {
            chapter_arr: props.chapter_arr,
            gorefreshing:false,
        };

        this._renderChapterItem = this.renderChapterItem.bind(this)
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

    renderMyBooksView(){
        if(this.state.books_data_source ==null){
            this.dofetch_mybooks();
            return (this.renderLoading())
        }else{
            return (this.renderMyBooks())
        }
    }

    onListItemClick(rowData, sectionID, rowID){

    }

    renderChapterItem(rowData, sectionID, rowID){

        return (
            <TouchableOpacity onPress={() => this.onListItemClick(rowData, sectionID, rowID)}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <View>
                        <Text>{rowData}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderChapterView(){
        return (
            <ScrollView
                style={styles.scrlist}>
                <ListView
                    ref="scrview"
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.chapter_arr)}
                    renderRow={this._renderChapterItem}
                    enableEmptySections = {true}
                />
            </ScrollView>
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderChapterView()}
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

EditChapter.PropTypes = {
    bookid:PropTypes.number,
    chapter_arr:PropTypes.object,

};

module.exports = EditChapter;