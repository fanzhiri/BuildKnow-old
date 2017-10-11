/**
 * Created by slako on 17/10/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView,TouchableOpacity,Alert,WebView,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        margin:6,
    },
    typeContainer: {
        alignItems:'center',
        flexDirection:'row',
        height: 32,
    },
    addwayContainer: {
        marginTop:6,
        justifyContent: 'center',
        height: 32,
    },
    segmentedcontrolcontainer: {
        width:200,
    },
    answertypecontainer: {
        height: 40,
        justifyContent: 'center',

        width:240,
    },
    answerinattcontainer: {
        height: 40,
        justifyContent: 'center',

        width:160,
    },
    descriptioninput:{
        fontSize:16,
        marginTop:6,
        height: 100,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    answerinput:{
        fontSize:16,
        marginTop:6,
        height: 60,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    explaininput:{
        fontSize:16,
        marginTop:6,
        height: 80,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    typetext:{
        fontSize:16,
    },
    addQuestionContainer:{
        height: 600,
    },
    submitbutton:{
        backgroundColor: '#00EE00'
    },bottomcontainer: {
        marginTop:10,
        backgroundColor: '#F5FCFF',
        alignItems:'center',
        flexDirection:'row',
        height:32,
    },buttoncontainer:{
        height:32,
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
    },
    clearbutton:{
        backgroundColor: '#FF1011'
    }
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";
//var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=testquestion";



class NewArticleQst extends Component {

    constructor(props) {
        super(props);
        let articlelink = "";


        this.state = {
            intype:props.intype,
            article_title:"",
            articlelink_shadow:"",
            articlelink:"https://www.baidu.com",
            refreshbutton:1, //1改动过
            qsts_data_source:null
        };
        this._renderQstItem = this.renderQstItem.bind(this);

    }

    articleLinkTextChange(text){
        this.setState({
            articlelink_shadow:text,
            refreshbutton:1
        })
    }

    onRefreshClick(){

        this.setState({
            articlelink:this.state.articlelink_shadow,
            refreshbutton:0
        })
    }

    renderRefreshButton(){

        let buttoncolor="#F000FF";
        if(this.state.refreshbutton == 1){
            buttoncolor="#00FF0F";
        }else if(this.state.refreshbutton == 2){
            buttoncolor="#B09090";
        }

        return(
            <TouchableOpacity onPress={()=>this.onRefreshClick()}>
                <View style={{height:32,justifyContent:"center",alignItems:"center",
                        backgroundColor:buttoncolor,
                        margin:6,borderRadius:8}}>
                    <Text>刷新</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderQstItem(rowData,sectionID, rowID){
        return(
            <View style={{height:32,borderBottomColor:"#0000FF"}}>

            </View>
        )
    }

    renderQstList(){
        if(this.state.qsts_data_source == null){
            return;
        }
        return(
            <ListView
                style={{flex:1,borderColor:"FF0000",margin:6}}
                dataSource={DataStore.cloneWithRows(this.state.qsts_data_source)}
                renderRow={this._renderQstItem}
                enableEmptySections = {true}
            />
        )
    }

    articleTitleChange(text){
        this.setState({
            article_title:text,
        })
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <View>
                    <TextInput
                        onChangeText={(text) => {this.articleTitleChange(text)}}
                        style={{fontSize:16,
                            marginTop:6,
                            height: 32,
                            borderColor: 'gray',
                            borderWidth: 2,
                            paddingLeft:10,
                            paddingRight:10}}
                        value={this.state.article_title}
                        placeholder={"填写标题"}
                        maxLength={20}
                        multiline={true}
                    />
                    <View style={{justifyContent:"center",alignItems:"center",height:32,margin:6}}>
                        <Text style={{fontSize:16}}>链接拷贝到如下边框,点击刷新</Text>
                    </View>


                    <TextInput
                        onChangeText={(text) => {this.articleLinkTextChange(text)}}
                        style={styles.answerinput}
                        value={this.state.articlelink_shadow}
                        placeholder={"请拷贝进来"}
                        maxLength={20}
                        multiline={true}
                    />

                </View>
                {this.renderRefreshButton()}
                <View style={{height:300,margin:6,borderWidth:1}}>
                    <WebView
                        source={{
                        uri: this.state.articlelink,
                        method: 'GET'
                    }}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        javaScriptEnabled={true}
                    />
                </View>
                <View style={{justifyContent:"center",alignItems:"center",height:32,margin:6,
                        backgroundColor:"#66CD00",
                        borderRadius:8
                        }}>
                    <Text>添加问题</Text>
                </View>

                {this.renderQstList()}
            </View>
        );
    }
}


NewArticleQst.PropTypes = {
    intype: PropTypes.number, //0新建 1查看
    qstlist: PropTypes.object,  //[查看]进入界面时 传进来的question list
    index:  PropTypes.number, //[查看]进入界面时 传进来的index
    bookid: PropTypes.number,
};
module.exports = NewArticleQst;