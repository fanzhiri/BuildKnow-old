/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    ListView,Image,WebView,
    Dimensions
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import Icon from 'react-native-vector-icons/Ionicons';

import DataStore from '../util/DataStore';

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
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:48
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
        backgroundColor: '#F5FCFF',
    }
});
const {width, height} = Dimensions.get('window');

var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

var knowledgeUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=knowledge";

class Discover extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,
            get_people_data:null,
            detialing:0,
            knowledge_list_data_source:null,
            get_knowledge_data:null,
            knowledgeItemUrl:null
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);
        this._doOnPress = this.doOnPress.bind(this);
        this._renderknowledgeRow = this.renderknowledgeRow.bind(this);
    }

    peoplelist(){
        let formData = new FormData();
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(peoplelistUrl,opts)
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
                        values={['用户','知识','需求']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>
        );
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
            if(this.state.detialing == 1){
                return (
                    this.renderNewItem()
                )
            }else{
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
            }

        } else if (this.state.selectedIndex === 2) {
            return (
                this.rendernodata()
            )
        }
    }

    onKnowledgeItemClick(rowData){
        this.setState({
            knowledgeItemUrl:rowData.url,
            detialing:1,
        })
    }

    renderknowledgeRow(rowData, sectionID, rowID) {
        return(
            <TouchableOpacity onPress={()=> this.onKnowledgeItemClick(rowData)} activeOpacity={0.8}>
                <View style={{
                    height:40,
                    backgroundColor: 'white',
                    borderColor: '#c4c4c4',
                    borderWidth: 1
                }}>
                    <Text style={{fontSize:20}}>{rowData.title}</Text>
                    <Text style={{fontSize:12}}>来源 100评论 时间</Text>
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
        this.setState({
            detialing:0,
        })
    }

    renderBackButton(){
        var iconColor="#0808FF";
        return(
            <View style={styles.topButtonitemcontainer}>
                <TouchableOpacity onPress={()=> this.onBackPressFunc()} activeOpacity={0.8}>
                    <View style={styles.IconItem}>
                        <Icon name={"ios-arrow-back"} size={32} color={iconColor}/>
                    </View>
                </TouchableOpacity>
                <View><Text style={{fontSize:16}}>来源  </Text></View>
                <View><Text style={{fontSize:16}}>关注  </Text></View>
                <View><Text style={{fontSize:16}}>题目  </Text></View>
            </View>
        )
    }

    renderBackBar(){
        return(
            <View style={{height:40,backgroundColor:'#00FF00',flexDirection:'row'}}>
                {this.renderBackButton()}
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

    renderPeople(people){
        var userId = (people.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId:userId,title:people.nickname,peopledata:people})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${people.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {people.nickname}
                        </Text>
                        <Text >
                            粉丝:{people.follow} 内测:{people.buildingshare} 在建:{people.buildingshare}  发布:{people.releaseshare}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderIntroduceView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.people_list_data_source)}
                renderRow={(rowData) => this._renderPeople(rowData)}
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

module.exports = Discover;