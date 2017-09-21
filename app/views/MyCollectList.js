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


var doGetMyCollectUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmycollect";
var httpsBaseUrl = "https://slako.applinzi.com/";

class MyCollectList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            //发布的
            books_data_source: null,
            get_books_data:0,
            //还没发布的
            bd_books_data_source: null,
            get_bd_books_data:0,
            //题目
            qsts_data_source: null,
            get_qsts_data:0,
            //考卷
            test_data_source: null,
            get_test_data:0,

            selectedIndex:0,
        };
        this._onChange              = this.onChange.bind(this);
        this._renderBookItem        = this.renderBookItem.bind(this);
        this._renderQuestionItem    = this.renderQuestionItem.bind(this);
        this._renderQstItem         = this.renderQstItem.bind(this);
        this._renderTestItem        = this.renderTestItem.bind(this);
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    dofetch_mycollectbooks(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        formData.append("collect_type",2);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyCollectUrl,opts)
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

    dofetch_mycollectqst(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("api","true");
        formData.append("userid",global.userid);
        formData.append("collect_type",1);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyCollectUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        qsts_data_source:responseData.data,
                        get_qsts_data:1
                    })
                }else{
                    this.setState({
                        get_qsts_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderMyBooksView(){

    }


    renderBookItem(rowData,sectionID, rowID){
        var cover = (rowData.cover);
        var bookid= (rowData.bookid);
        return (
            <TouchableOpacity onPress={() => Actions.bookcover({bookpublicid:rowData.reviewid})}>
                <View style={styles.listItem}>
                    <Image source={{uri:`${httpsBaseUrl}${cover}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.bookname}
                        </Text>

                        <Text >
                            {rowData.bookbrief}
                        </Text>
                        <Text >
                            题数:{rowData.questioncount}  收藏:  评论:{10}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderQuestionItem(rowData,sectionID, rowID){
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

    renderMyCollectBooks(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.books_data_source)}
                renderRow={this._renderBookItem}
                enableEmptySections = {true}
            />
        )
    }

    renderMyCollectQsts(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.qsts_data_source)}
                renderRow={this._renderQstItem}
                enableEmptySections = {true}
            />
        )
    }

    renderMyCollectTest(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.test_data_source)}
                renderRow={this._renderTestItem}
                enableEmptySections = {true}
            />
        )
    }

    renderCollectBook(){
        if(this.get_books_data == 0){
            this.dofetch_mycollectbooks();
            return (this.renderLoading())
        }else{
            if(this.state.books_data_source == null){
                return (this.rendernodata())
            }else{
                return (this.renderMyCollectBooks())
            }
        }
    }

    renderCollectQuestion(){
        if(this.get_qsts_data == 0){
            this.dofetch_mycollectqst();
            return (this.renderLoading())
        }else{
            if(this.state.qsts_data_source == null){

                return (this.rendernodata())
            }else{
                return (this.renderMyCollectQsts())
            }
        }

    }

    renderCollectTest(){
        if(this.get_test_data == 0){
            this.dofetch_mycollectqst();
            return (this.renderLoading())
        }else{
            if(this.state.test_data_source == null){
                return (this.rendernodata())
            }else{
                return (this.renderMyCollectTest())
            }
        }

    }

    renderFragment(){
        switch (this.state.selectedIndex){
            case 0:
                return(this.renderCollectQuestion());
                break;
            case 1:
                return(this.renderCollectBook());
                break;
            case 2:
                return(this.renderCollectTest());
                break;
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['题目','书目','考卷']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>

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
    rendernodata(){
        return (
            <View style={styles.container}>
                <Text>没有数据</Text>
            </View>
        )
    }
}

module.exports = MyCollectList;