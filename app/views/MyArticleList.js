/**
 * Created by slako on 17/10/01.
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

var doGetMyBooksUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmybooks";

var doGetMyArticlesUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getarticle";

var httpsBaseUrl = "https://slako.applinzi.com/";

var doCloneQstUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=cloneqst";

class MyArticleList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            books_data_source: null,
            articles_data_source: null,
            get_articledata:0,
            gorefreshing:false,
        };

        this._renderArticleItem = this.renderArticleItem.bind(this)
    }

    dofetch_myarticles(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetMyArticlesUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        articles_data_source:responseData.data,
                        get_get_articledata:1
                    })
                }else{
                    this.setState({
                        get_get_articledata:2
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
        if(this.state.articles_data_source == null){
            if(this.state.get_articledata == 0){
                this.dofetch_myarticles();
                return (this.renderLoading())
            }else{
                return(<EmptyData/>)
            }

        }else{
            return (this.renderMyArticles())
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
                this.dofetch_CloneQst(rowData.question_book_id);
            }else{
                Actions.pop();
            }
        }
    }

    onKnowledgeItemClick(){

    }

    renderArticleItem(rowData, sectionID, rowID){

        return (
            <TouchableOpacity onPress={()=> this.onKnowledgeItemClick(rowData)} activeOpacity={0.8}>
                <View style={{

                    backgroundColor: 'white',
                    borderColor: '#c4c4c4',
                    borderWidth: 1,
                    paddingLeft:8,
                    paddingRight:8
                }}>
                    <Text style={{fontSize:16,marginBottom:4,color:"#E08020"}}>{rowData.title}</Text>
                    <Text style={{fontSize:12,marginBottom:4}}>{rowData.description}</Text>
                    <Text style={{fontSize:10}}>来源 100评论 时间 题目数:{rowData.qsnum}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderMyArticles(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_myarticles()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.articles_data_source)}
                renderRow={this._renderArticleItem}
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

MyArticleList.PropTypes = {
    inmode: PropTypes.number.isRequired,//0查看，1选择
    intype: PropTypes.number,//1 克隆
    qstid:PropTypes.number,
    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,
};


module.exports = MyArticleList;