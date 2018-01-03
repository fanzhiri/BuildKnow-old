/**
 * Created by slako on 18/01/03.
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

var doGetBookListUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=getallbooks";
let doGetJobUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=getjob";
var httpsBaseUrl = "https://slako.applinzi.com/";

let educationtext=['不限','大专','本科','研究生','博士','博士后'];

let salarytext=['2000以下','2000 - 3000','3000 - 4500','4500 - 6000','6000 - 8000','8000 - 10000','10000 - 15000','15000 - 20000','20000 - 30000','30000 - 40000','40000 - 50000','50000 - 60000'];

class JobDetail extends Component {

    constructor(props) {

        super(props);

        this.state = {
            job_data:props.jobdata,
            get_jobdata:(props.jobdata == null)?false:true,
            gorefreshing:false,
        };

        this._renderBookItem = this.renderBookItem.bind(this)
    }

    fetchJobDetail(){

        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("jobid",this.props.jobid);
        //alert(this.props.jobid);
        let opts = {
            method:"POST",
            body:formData
        };

        fetch(doGetJobUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        job_data:responseData.data,
                        get_bookdata:true
                    })
                }else{
                    alert(responseData.message);
                    this.setState({
                        get_bookdata:true
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }



    renderJobView(){
        if(this.state.job_data == null){
            if(this.state.get_bookdata){
                return(<EmptyData/>)
            }else{
                this.fetchJobDetail();
                return (<LoadingData/>)
            }

        }else{
            return (this.renderJob())
        }
    }

    onItemPress(rowData){
        Actions.bookcover({bookpublicid:rowData.bookid,title:rowData.bookname})
    }

    renderBookItem(rowData, sectionID, rowID){
        let cover = rowData.cover;
        return (
            <TouchableOpacity onPress={() => this.onItemPress(rowData)}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <Image source={{uri:`${httpsBaseUrl}${cover}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.name}
                        </Text>

                        <Text >
                            需要熟练度：{rowData.proficient}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderJob() {
        return(
            <View>
                <View style={{height:120,margin:8,borderRadius:10,padding:10,backgroundColor:"#76EEC6"}}>
                    <Text style={{fontSize:18}}>{this.props.jobdata.name}</Text>
                    <Text>{this.props.jobdata.workplace}</Text>
                    <Text>{this.props.jobdata.jobyearlow} - {this.props.jobdata.jobyearhigh} 年</Text>
                    <Text>{educationtext[this.props.jobdata.education]}</Text>
                    <Text>月薪：{salarytext[this.props.jobdata.salary]}</Text>
                </View>
                {this.renderJobBooks()}
            </View>
        )
    }


    renderJobBooks(){

        if(this.state.job_data.bookitemlist == null){
            return;
        }

        let booklist = JSON.parse(this.state.job_data.bookitemlist);

        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.fetchJobDetail()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(booklist)}
                renderRow={this._renderBookItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderJobView()}
            </View>
        );
    }


}

JobDetail.PropTypes = {
    jobid:PropTypes.number,
    jobdata:PropTypes.object,
    inmode: PropTypes.number.isRequired,//0查看，1选择

    cvst_id: PropTypes.number,//发送给会话人时用
    chattoid:PropTypes.number,

};
/*
* 用途：
* */

module.exports = JobDetail;