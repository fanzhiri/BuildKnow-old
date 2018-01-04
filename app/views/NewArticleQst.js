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
    },
    segmented:{
        margin:4,
    },
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";
//var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=testquestion";

const MAX_ITEM = 10 ;

class NewArticleQst extends Component {

    constructor(props) {
        super(props);
        let articlelink = "";
        let t_qsts_data_source = new Array();
        this.state = {
            intype:props.intype,
            article_title:"",
            articlelink_shadow:"",
            articlelink:"https://www.baidu.com",
            refreshbutton:2, //1改动过
            qsts_data_source:t_qsts_data_source,
            select_idx:-1,
            selectedIndex:0
        };
        this._renderQstItem = this.renderQstItem.bind(this);
        this._onChange              = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.qstdata == null){
            return;
        }
        let t_qsts_data_source = this.state.qsts_data_source;
        //alert(nextProps.qstdata.questionid);
        t_qsts_data_source[this.state.select_idx].questionid = nextProps.qstdata.questionid;
        t_qsts_data_source[this.state.select_idx].ask = nextProps.qstdata.ask;

        this.setState({
            qsts_data_source:t_qsts_data_source
        });
    }

    articleLinkTextChange(text){
        this.setState({
            articlelink_shadow:text,
            refreshbutton:1
        })
    }

    onRefreshClick(){

        if(this.state.articlelink_shadow == ""){
            return;
        }
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

    change_item(rowID){

        this.setState({
            select_idx:rowID
        });

        Actions.mycollectlist({intype:1,processprop:0,inmode:2});
    }

    del_item(rowID){

        let t_qsts_data_source=this.state.qsts_data_source;

        t_qsts_data_source.splice(rowID,1);

        this.setState({
            qsts_data_source:t_qsts_data_source
        })
    }

    renderSelectChangeDel(rowData,rowID){
        if(rowData.questionid == 0){
            return(
                <TouchableOpacity style={{flex:1}} onPress={() => this.change_item(rowID)}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>点击选择</Text>
                    </View>
                </TouchableOpacity>
            )
        }else{
            return(
                <View style={{flexDirection:"row",height:24,alignItems:"center",flex:1}}>
                    <Text style={{marginLeft:2,flex:6}}>{rowData.ask.substring(0,16)}</Text>
                    <TouchableOpacity style={{flex:1}} onPress={() => this.change_item(rowID)}>
                        <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                            <Text>修改</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1}} onPress={() => this.del_item(rowID)}>
                        <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                            <Text>删除</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    renderQstItem(rowData,sectionID, rowID){
        return(
            <View style={{height:28,borderWidth:1,borderBottomColor:"#0000FF",flexDirection:"row",alignItems:"center",marginTop:2}}>
                <Text>{rowID}</Text>
                {this.renderSelectChangeDel(rowData,rowID)}
            </View>
        )
    }

    renderQstList(){
        if(this.state.qsts_data_source == null){
            return;
        }
        return(
            <ListView
                style={{flex:1,borderColor:"#FF0000",margin:6,padding:6}}
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

    onAddOneClick(){
        let remainadd = MAX_ITEM - this.state.qsts_data_source.length;
        if(remainadd == 0){
            return;
        }
        let t_qsts_data_source=this.state.qsts_data_source;
        let itemone ={
            questionid:0,
            ask:"",
            sortnum:MAX_ITEM-remainadd + 1,
        };
        t_qsts_data_source.push(itemone);
        this.setState({
            qsts_data_source:t_qsts_data_source
        })
    }

    renderSegmentSelect(){
            return(
                <View>
                    <SegmentedControlIOS
                        values={['文章','附题']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
            )
    }

    renderSegmentView(){
        if(this.state.selectedIndex == 0){
            return(this.renderArticle());
        }else{
            return(this.renderQstListView());
        }
    }

    render(){
        return(
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                {this.renderSegmentSelect()}
                {this.renderSegmentView()}
            </View>
        )
    }

    renderQstListView(){
        return(
            <View style={{flex:1,margin:6}}>
                <TouchableOpacity onPress={() => this.onAddOneClick()}>
                    <View style={{justifyContent:"center",alignItems:"center",height:32,margin:6,
                        backgroundColor:"#66CD00",
                        borderRadius:8
                        }}>
                        <Text>添加问题</Text>
                    </View>
                </TouchableOpacity>

                {this.renderQstList()}
            </View>

        );
    }
    renderArticle(){
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
                {/*<View style={{justifyContent:"center",alignItems:"center",height:32,margin:6}}>*/}
                    {/*<Text style={{fontSize:16}}>链接拷贝到如下边框,点击刷新</Text>*/}
                {/*</View>*/}

                <TextInput
                    onChangeText={(text) => {this.articleLinkTextChange(text)}}
                    style={styles.answerinput}
                    value={this.state.articlelink_shadow}
                    placeholder={"链接拷贝到这里,点击刷新"}
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

            </View>
        );
    }
}


NewArticleQst.PropTypes = {
    intype: PropTypes.number, //0新建 1查看
    qstlist: PropTypes.object,  //[查看]进入界面时 传进来的question list
    index:  PropTypes.number, //[查看]进入界面时 传进来的index
    bookid: PropTypes.number,
    qstdata:PropTypes.object,
};
module.exports = NewArticleQst;