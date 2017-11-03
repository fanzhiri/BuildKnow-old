/**
 * Created by slako on 17/11/02.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    ListView,Image,WebView,
    Dimensions,
    RefreshControl
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import Icon from 'react-native-vector-icons/Ionicons';

import DataStore from '../util/DataStore';

import {PicBaseUrl} from '../util/Attributes';

import LoadingData from '../component/LoadingData';
import EmptyData from '../component/EmptyData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
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
    topTitleStyle:{
        fontSize:20,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:0
    },
    topButtonitemcontainer:{
        height:40,
        justifyContent: 'center',
        flexDirection:'row',
        alignItems: 'center',
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height:40,
        backgroundColor: '#F5FCFF',
    },
    questionitemcontainer:{

        padding:5,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#ab82ff',
    },
});
const {width, height} = Dimensions.get('window');

var allpeoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=allpeoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

var knowledgeUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=knowledge";

var categoryUrl  = "https://slako.applinzi.com/index.php?m=question&c=index&a=category";

var knowledgeQstUrl  = "https://slako.applinzi.com/index.php?m=question&c=index&a=knowledgequestion";

class MemberList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,
            get_people_data:null,
            detialing:0,//0 list 1 indetial 2question
            knowledge_list_data_source:null,
            get_knowledge_data:null,
            knowledgeItemUrl:null,
            cataloguebardata:null,
            get_category_data:null,

            knowledgeqst_data_source:null,
            categorySelect:0,
            knowledgeItemData:null,
            gorefreshing:false
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);
        this._doOnPress = this.doOnPress.bind(this);
        this._renderknowledgeRow = this.renderknowledgeRow.bind(this);
        this._renderCatalogueBarRow = this.renderCatalogueBarRow.bind(this);
        this._renderQuestionItem = this.renderQuestionItem.bind(this);
    }

    peoplelist(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(allpeoplelistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        people_list_data_source:responseData.data,
                        get_people_data:1
                    })
                }else{
                    this.setState({
                        netresult:responseData.code,
                        get_people_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_knowledge(){
        let formData = new FormData();
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(knowledgeUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        knowledge_list_data_source:responseData.data,
                        get_knowledge_data:1
                    })
                }else{
                    this.setState({
                        get_knowledge_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_category(){
        let formData = new FormData();
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(categoryUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        cataloguebardata:responseData.data,
                        get_category_data:1
                    })
                }else{
                    this.setState({
                        get_category_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_knowledgeqst(id){
        let formData = new FormData();
        formData.append("api","true");
        formData.append("knowledgeid",id);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(knowledgeQstUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        detialing:2,//查看题目列表
                        knowledgeqst_data_source:responseData.data,
                        get_knowledgeqst_data:1
                    })
                }else{
                    alert(responseData.message)
                    alert(id)
                    this.setState({
                        get_knowledgeqst_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['用户','企业','管理员']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderCatalogueBar()}
                {this.renderSegmentedView()}
            </View>
        );
    }

    onCateloguePressFunc(rowID){
        this.setState({
            categorySelect: rowID,
        });
    }

    renderCatalogueBarRow(rowData, sectionID, rowID){
        let cateColor ;
        if(this.state.categorySelect == rowID){
            cateColor="#FF0000";
        }else{
            cateColor="#000000";
        }
        return(
            <TouchableOpacity onPress={()=> this.onCateloguePressFunc(rowID)} activeOpacity={0.8}>
                <Text style={{marginRight:6,marginLeft:6,color:cateColor}}>{rowData.catname}</Text>
            </TouchableOpacity>
        )
    }

    renderCatalogueBar(){
        if(this.state.selectedIndex === 1 && this.state.detialing == 0) {
            if(this.state.get_category_data == null){
                this.fetch_category();
                return;
            }else if(this.state.get_category_data == 2){
                return;
            }
            return(
                <View  style={{height:32,backgroundColor:'#F0FF00',flexDirection:'row',alignItems: 'center',}}>
                    <ListView
                        enableEmptySections={true}
                        horizontal={true}
                        dataSource={DataStore.cloneWithRows(this.state.cataloguebardata)}
                        renderRow={this._renderCatalogueBarRow} />
                </View>
            )
        }
    }

    gocheckquestion(rowID){
        Actions.newsomequestions({title:"题目查看",intype:1,qstlist:this.state.knowledgeqst_data_source,index:rowID});
    }

    renderQuestionItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        var qId = (rowData.questionid);
        return (
            <TouchableOpacity  onPress={()=> this.gocheckquestion(rowID)}  >
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {parseInt(rowID)+1} : {ask.substring(0,20)}
                    </Text>

                </View>
            </TouchableOpacity>

        )
    }

    renderklqst(){
        return(
            <View>
                {this.renderBackBar()}
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.knowledgeqst_data_source)}
                    renderRow={this._renderQuestionItem}
                    enableEmptySections = {true}
                />
            </View>

        )
    }

    renderWeekMonthYear(){
        return(
            <View style={{height:32,flexDirection:"row"}}>
                <View style={{flex:4,justifyContent:"center",alignItems:"center",backgroundColor:"#6495ED"}}><Text>每周</Text></View>
                <View style={{flex:2,justifyContent:"center",alignItems:"center",backgroundColor:"#BDB76B"}}><Text>每月</Text></View>
                <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#CD1076"}}><Text>每年</Text></View>
            </View>
        )
    }

    renderEvent(){
        return(
            <View style={{flex:1}}>
                {this.renderWeekMonthYear()}
            </View>
        )
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {

            if(this.state.people_list_data_source){

                return (this.renderIntroduceView())
            }else{
                if(this.state.get_people_data == null){
                    this._peoplelist();
                    return (this.renderLoading())
                }else{
                    return (
                        this.rendernodata()
                    )
                }
            }
        } else if (this.state.selectedIndex === 1) {
            //知识点列表栏
            if(this.state.detialing == 1){
                return (
                    this.renderNewItem()
                )
            }else if(this.state.detialing == 0){

                if(this.state.knowledge_list_data_source != null){
                    return(this.renderKnowledgeList())
                }else{
                    if(this.state.get_knowledge_data != null){
                        return (
                            this.rendernodata()
                        )
                    }else{
                        this.fetch_knowledge();
                        return (this.renderLoading())
                    }
                }
            }else if(this.state.detialing == 2){
                if(this.state.knowledgeqst_data_source != null){

                    return (
                        this.renderklqst()
                    )
                }else{
                    return (this.renderLoading())
                }
            }

        } else if (this.state.selectedIndex === 2) {
            //活动专栏
            return (
                this.renderEvent()
            )
        }
    }

    onKnowledgeItemClick(rowData){
        this.setState({
            knowledgeItemUrl:rowData.url,
            detialing:1,
            knowledgeItemData:rowData
        })
    }

    renderknowledgeRow(rowData, sectionID, rowID) {
        return(
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

    renderKnowledgeList(){
        return(
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.knowledge_list_data_source)}
                renderRow={this._renderknowledgeRow}
                enableEmptySections = {true}
            />
        )
    }

    onBackPressFunc(){
        let t_datialing=this.state.detialing;
        t_datialing = t_datialing - 1;

        this.setState({
            detialing:t_datialing,
        })
    }

    onQstPressFunc(id){
        this.fetch_knowledgeqst(id);
    }

    renderGoQstButton(){
        if(this.state.knowledgeItemData.qsnum != 0 && this.state.detialing ==1){
            return(
                <TouchableOpacity onPress={()=> this.onQstPressFunc(this.state.knowledgeItemData.id)} activeOpacity={0.8}>
                    <View><Text style={{fontSize:16}}>题目:{this.state.knowledgeItemData.qsnum}</Text></View>
                </TouchableOpacity>
            )
        }

    }

    renderBackButton(){
        var iconColor="#0808FF";
        return(
            <TouchableOpacity onPress={()=> this.onBackPressFunc()} activeOpacity={0.8}>
                <View style={styles.IconItem}>
                    <Icon name={"ios-arrow-back"} size={32} color={iconColor}/>
                </View>
            </TouchableOpacity>
        )
    }

    renderBackBar(){
        return(
            <View style={{height:40,backgroundColor:'#00FF00',flexDirection:'row',alignItems: 'center',}}>
                {this.renderBackButton()}
                <View><Text style={{fontSize:16}}> 来源 </Text></View>
                <View><Text style={{fontSize:16}}> 关注 </Text></View>
                {this.renderGoQstButton()}
            </View>
        )
    }

    renderNewItem(){
        return(
            <View style={{flex:1}}>
                {this.renderBackBar()}
                <WebView

                    source={{
                        width:width,height:height-80,
                        uri: this.state.knowledgeItemUrl,
                        method: 'GET'
                    }}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                />
            </View>
        )
    }


    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    doOnPress(userid){
        Actions.homepage({userid});
    }

    renderPeople(rowData,sectionID, rowID){
        var userId = (rowData.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId:userId,title:rowData.nickname,peopledata:rowData})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${PicBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.nickname}
                        </Text>
                        <Text >
                            粉丝:{rowData.follow} 内测:{rowData.buildingshare} 在建:{rowData.buildingshare}  发布:{rowData.releaseshare}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderIntroduceView(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this._peoplelist()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.people_list_data_source)}
                renderRow={this._renderPeople}
                enableEmptySections = {true}
            />
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

module.exports = MemberList;