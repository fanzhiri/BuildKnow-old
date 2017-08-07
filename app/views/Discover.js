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
    }

});
const {width, height} = Dimensions.get('window');

var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

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
            get_knowledge_data:null
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);
        this._doOnPress = this.doOnPress.bind(this);

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

                    }
                }
            }

        } else if (this.state.selectedIndex === 2) {
            return (
                this.rendernodata()
            )
        }
    }

    renderKnowledgeList(){
        return(
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.knowledge_list_data_source)}
                renderRow={(rowData) => this._renderPeople(rowData)}
                enableEmptySections = {true}
            />
        )
    }

    onBackPressFunc(){

    }

    renderBackButton(){
        var iconColor="#0808FF";
        return(
            <TouchableOpacity onPress={()=> onBackPressFunc} activeOpacity={0.8}>
                <View style={styles.topButtonitemcontainer}>
                    <View style={styles.IconItem}>
                        <Icon name={"ios-arrow-back"} size={22} color={iconColor}/>
                    </View>
                </View>
            </TouchableOpacity>
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
                        uri: "http://www.360jk.com/article/4828.html",
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