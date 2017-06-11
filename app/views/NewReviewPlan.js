/**
 * Created by slako on 17/06/07.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

import ImagePicker from "react-native-image-picker";
import TcombForm from "tcomb-form-native";
import DataStore from '../util/DataStore';
import Icon from 'react-native-vector-icons/Ionicons';

var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BCEEE8',
        margin:10
    },
    nameinput:{
        fontSize:22,
        height: 32,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:18,
        height: 64,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    titlecontainer:{

        margin:10,
        justifyContent: 'space-around',
        flexDirection:'row',
    },sumcontainer:{
        margin:10,
        height:30,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor: '#AEEEEE'
    },
    editcontainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        width:180,
    },
    timestringcontainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width:40,
    },
    submitbutton:{

        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AEE00E'
    },
    twobutton:{
        flex:1
    },
    namecontainer:{
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

var doCommitNewPlanPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addreviewplan";


class NewReviewPlan extends Component {

    constructor(props) {

        super(props);

        let aibinhaoshi=[
            1,24,24,24*2,24*3,24*5,24*8,24*15,
            24*30,24*30*2,24*30*4,24*30*6,24*30*8,24*30*10,24*30*12,
            24*30*14,24*30*16,24*30*18,24*30*20,24*30*22,
            24*30*24,24*30*24,24*30*24,24*30*24,24*30*24,24*30*24
        ];
        var sum=0;
        for(var i=0;i<aibinhaoshi.length;i++){
            sum+=aibinhaoshi[i];
        }

        let init_name = null;
        let init_brief = null;
        let init_planid = 0;
        if(this.props.modetype == 0){
            init_name = this.props.plandata.name;
            init_brief = this.props.plandata.brief;
            init_planid = this.props.plandata.id;
        }else{
            init_name = "";
            init_brief = "";
        }

        this.state = {
            plan_data_source:aibinhaoshi,
            datesum:sum,
            modetype:this.props.modetype,
            name:init_name,
            brief:init_brief,
            planid:init_planid
        };
        //0查看 1编辑
        this._renderPlanItem = this.renderPlanItem.bind(this)
    }



    dosubmit(){


        if(this.state.name == ""){
            return;
        }
        if(this.state.brief == ""){
            return;
        }
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("planid",this.state.planid);
        formData.append("name",this.state.name);
        formData.append("brief",this.state.brief);
        formData.append("remaininterval",JSON.stringify(this.state.plan_data_source));

        var opts = {
            method:"POST",
            body:formData
        }

        fetch(doCommitNewPlanPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    rendertimeajust(time,timestring){
        if(this.state.modetype == 1){
            return(
                <View style={styles.editcontainer}>
                    <Icon name={"md-arrow-dropleft"} size={22} color={"#FF0000"}/>
                    <Icon name={"md-arrow-dropleft"} size={22} color={"#FF0000"}/>
                    <Text style={styles.timestringcontainer}>{time} {timestring}</Text>
                    <Icon name={"md-arrow-dropright"} size={22} color={"#FF0000"}/>
                    <Icon name={"md-arrow-dropright"} size={22} color={"#FF0000"}/>
                    <Icon name={"md-download"} size={22} color={"#FF0000"}/>
                    <Icon name={"md-close-circle"} size={22} color={"#FF0000"}/>
                </View>
            )
        }else{
            return(
                <View>
                    <Text>{time} {timestring}</Text>
                </View>
            )
        }

    }

    renderPlanItem(rowData, sectionID, rowID){
        let time = 0;
        let timestring=null;
        if(rowData >= (24*30*12)){
            time=Math.floor(rowData/(24*30*12));
            timestring="年";
        }else if(rowData >= (24*30)){
            time=Math.floor(rowData/(24*30));
            timestring="月";
        }else if(rowData >= (24)){
            time=Math.floor(rowData/24);
            timestring="日";
        }else{
            time=rowData;
            timestring="时";
        }
        return(
            <View style={styles.titlecontainer}>
                <Text>{parseInt(rowID)+1}</Text>
                {this.rendertimeajust(time,timestring)}
            </View>
        )
    }

    onpressfunc(dowhat){
        switch (dowhat){
            case 0://进入编辑
                this.setState({
                    modetype:1
                })
                break;
            case 1://取消编辑
                this.setState({
                    modetype:0
                })
                break;
            case 2://提交
                this.dosubmit();
                break;
        }
    }

    rendereditorsubmit(){

        if(this.state.modetype == 0){

            return(
                    <TouchableOpacity onPress={() => this.onpressfunc(0)} activeOpacity={0.8}>
                        <View  style={styles.submitbutton}>
                            <Text>编辑</Text>
                        </View>
                    </TouchableOpacity>
                )

        }else if(this.state.modetype == 1){

            return(
            <View style={{flexDirection:'row',height:30,justifyContent: 'space-around',}}>
                <TouchableOpacity onPress={() => this.onpressfunc(1)} activeOpacity={0.8}>
                    <View  style={[styles.submitbutton,styles.twobutton]}>
                        <Text>撤销修改</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onpressfunc(2)} activeOpacity={0.8}>
                    <View  style={[styles.submitbutton,styles.twobutton]}>
                        <Text>提交</Text>
                    </View>
                </TouchableOpacity>
            </View>


            )
        }

    }

    rendername(){
        if(this.state.modetype == 1){
            return(
                <View style={styles.namecontainer}>
                    <TextInput
                        style={styles.nameinput}
                        onChangeText={(text) => this.setState({name:text})}
                        value={this.state.name}
                        placeholder={"名字：请添写最多10字"}
                        maxLength={10}
                        multiline={false}
                    />
                </View>
            )
        }else{
            let showname=this.state.name;
            if(showname ==""){
                showname="未编辑";
            }
            return(
                <View style={styles.namecontainer}>
                    <Text style={{fontSize: 24}}>名字：{showname}</Text>
                </View>
            )

        }
    }

    renderbrief(){
        if(this.state.modetype == 1){
            return(
                <View style={styles.namecontainer}>
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({brief:text})}
                        value={this.state.brief}
                        placeholder={"简介：请添写最多20字"}
                        maxLength={20}
                        multiline={true}
                    />
                </View>
            )
        }else{
            let showbrief=this.state.brief;
            if(showbrief ==""){
                showbrief="未编辑";
            }
            return(
                <View style={styles.namecontainer}>
                    <Text style={{fontSize: 20}}>描述：{showbrief}</Text>
                </View>
            )

        }
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                {this.rendername()}
                {this.renderbrief()}
                <View style={styles.titlecontainer}>
                    <Text>次数号</Text>
                    <Text>离上次时间</Text>
                </View>
                <ScrollView>
                    <ListView
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.plan_data_source)}
                        renderRow={this._renderPlanItem}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.sumcontainer}>
                    <Text>共 {this.state.plan_data_source.length} 次</Text>
                    <Text>持续 {Math.floor(this.state.datesum/24)} 天</Text>
                </View>
                {this.rendereditorsubmit()}
            </View>
        );
    }
}
//0查看 1编辑 2新建
NewReviewPlan.PropTypes = {
    modetype:PropTypes.number,
    plandata:PropTypes.object
};

module.exports = NewReviewPlan;