/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ListView, SegmentedControlIOS, Image,TouchableOpacity} from "react-native";
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
    },questionitemcontainer:{
    padding:5,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#ab82ff',
    },
    segmented:{
        margin:4,
    },
});


var doGetMyCollectUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getmycollect";
var httpsBaseUrl = "https://slako.applinzi.com/";
var sendMsgUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=sendmsg";

class MyCollectList extends Component {

    constructor(props) {

        super(props);

        let t_selectedIndex = -1;
        if(props.processprop != -1) {
            t_selectedIndex = props.processprop;
        }

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

            selectedIndex:t_selectedIndex,
        };
        this._onChange              = this.onChange.bind(this);
        this._renderBookItem        = this.renderBookItem.bind(this);

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
                        books_data_source:responseData.data,
                        get_books_data:1
                    })
                }else{
                    this.setState({
                        get_books_data:2
                    })
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



    renderBookItem(rowData,sectionID, rowID){
        var cover = (rowData.cover);
        var bookid= (rowData.bookid);
        return (
            <TouchableOpacity onPress={() => this.pressCollect(rowData,3)}>
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

    renderTestItem(rowData,sectionID, rowID){
        return(
            <View style={{height:32}}></View>
        )
    }

    fetch_sendCollectQst(rowData){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("attachmentid",rowData.questionid);
        formData.append("conversationid",this.props.cvst_id);
        formData.append("chattoid",this.props.chattoid);
        formData.append("msg_type",2);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sendMsgUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(responseData.data)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_sendCollect(rowData,whichtype){
        let attachmentid,msg_type;
        switch (whichtype){
            //
            case 2 :
                attachmentid = rowData.questionid;
                msg_type = whichtype;
                break;
            case 3 :
                attachmentid = rowData.reviewid;
                msg_type = whichtype;
                break;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("attachmentid",attachmentid);
        formData.append("conversationid",this.props.cvst_id);
        formData.append("chattoid",this.props.chattoid);
        formData.append("msg_type",msg_type);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sendMsgUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(responseData.data)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    finishToMarketManage(rowData){
        Actions.pop({refresh:{bookdata:rowData}});
    }
    finishToNewArticleQst(rowData){
        Actions.pop({refresh:{qstdata:rowData}});
    }

    pressCollect(rowData,whichtype){
        if(this.props.intype == 1){
            switch (whichtype){//2问题，3书目
                case 2 :
                    if(this.props.inmode == 2){
                        this.finishToNewArticleQst(rowData);
                    }else{
                        this.fetch_sendCollectQst(rowData);
                    }
                    break;
                case 3 :
                    if(this.props.inmode == 1){
                        this.finishToMarketManage(rowData);
                    }else{
                        this.fetch_sendCollect(rowData,whichtype);
                    }

                    break;
            }

        }else{
            switch (whichtype){
                case 2 : break;
                case 3 :Actions.bookcover({bookpublicid:rowData.reviewid}); break;
            }

        }
    }

    renderQstItem(rowData,sectionID, rowID){
        var ask = (rowData.ask);
        var qId = (rowData.questionid);

        return (
            <TouchableOpacity onPress={() => this.pressCollect(rowData,2)}>
                <View  style={styles.questionitemcontainer}>
                    <Text style={styles.questionitem}>
                        {parseInt(rowID)+1} : {ask.substring(0,20)}
                    </Text>
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
        if(this.state.get_books_data == 0){
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

        if(this.state.get_qsts_data == 0){
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
        if(this.state.get_test_data == 0){
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

    renderSegmentSelect(){
        if(this.props.processprop == -1){
            return(
                <View>
                    <SegmentedControlIOS
                        values={['题目','书目','考卷']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
            )
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderSegmentSelect()}
                {this.renderFragment()}
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

MyCollectList.defaultProps={
    processprop:-1
};

MyCollectList.PropTypes = {
    intype:PropTypes.number,        //操作形态    0查看，1选择
    processprop:PropTypes.number,   //显示属性    -1都选，0只显示收藏题目 1只显示收藏书目
    inmode:PropTypes.number,        //操作目标    0标识向某个会话发送,1单选收藏书目添加到上架模块  2单选题目回到NewArticleQst
    //第一次对话，用到chattoid
    cvst_id:PropTypes.number,//标识向某个会话发送收藏
    chattoid:PropTypes.number,

    //

};

module.exports = MyCollectList;