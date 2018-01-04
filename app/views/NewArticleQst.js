/**
 * Created by slako on 17/10/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView,TouchableOpacity,Alert,WebView,ListView,Keyboard} from "react-native";
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

let addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
let addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

let doCommitPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addarticleqst";


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
            selectedIndex:0,
            uploading:0
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

    docommit(){
        if(this.state.uploading == 1){
            return;
        }
        this.setState({
            uploading:1,
        });
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("articletitle",this.state.article_title);
        formData.append("articlelink",this.state.articlelink);

        let qstids = new Array();
        for(let i=0;i<this.state.qsts_data_source.length;i++){
            qstids.push(this.state.qsts_data_source[i].questionid);
        }
        formData.append("qsts",JSON.stringify(qstids));
        formData.append("qsnum",this.state.qsts_data_source.length);

        let opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        uploading:0,
                    });
                    Alert.alert('操作提示','提交成功',[
                        {text:'ok'}
                    ]);
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                    this.setState({
                        uploading:0,
                    });
                }

            })
            .catch((error) => {
                alert(error);
                this.setState({
                    uploading:0,
                });
            })
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
        });
        Keyboard.dismiss();
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

                <TouchableOpacity onPress={() => this.docommit()}>
                    <View style={{justifyContent:"center",alignItems:"center",height:32,margin:6,
                        backgroundColor:"#66CD00",
                        borderRadius:8
                        }}>
                        <Text>提交文推</Text>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
    renderArticle(){
        return (
            <View>
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
                <View style={{height:400,margin:6,borderWidth:1}}>
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