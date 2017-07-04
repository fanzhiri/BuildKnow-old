/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import XDate from 'xdate';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },selectbuttontext:{

        fontSize:18,
    },
    addbuttontext:{

        fontSize:18,
    }

});

var newScheduleUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addschedule";
var getScheduleUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getschedule";

var getOneScheduleUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getoneschedule";

class Schedule extends Component {

    constructor(props) {
        super(props);
        let newItems = {};
        //if(this.props.intype == 1){
        const time = new Date().getTime();
        const strTime = this.timeToString(time);
        newItems[strTime] = [];
        newItems[strTime].push({
            name: '从这天开始吗？点击下面的添加',
            height: 38
        });


        //alert('init')
        //}
        this.state = {
            items: newItems,
            initTime:this.nowTimeToString(),
            adddone:0,
            planitems:newItems,
            afteradd:newItems,
            selectdaystring:this.nowTimeToString(),
            book:this.props.book,
            act:0, //0添加 1修改,
            allcollectbooks:null,
            getdata:null,
            getonedata:null
        };

    }
    componentWillMount(){

    }

    selectplantoschedule(){
        Actions.reviewplan({intype:1});
    }

    fetchschedule(){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);

        var opts = {
            method:"POST",
            body:formData
        }

        fetch(getScheduleUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    let planarr=responseData.data;

                    this.setState({
                        getdata:1,
                        items:planarr,
                        allcollectbooks:responseData.data
                    })
                }else{
                    alert(responseData.message)
                    this.setState({
                        getdata:2,
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetchoneschedule(){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.state.book.reviewid);
        var opts = {
            method:"POST",
            body:formData
        }

        fetch(getOneScheduleUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    let plan=responseData.data;

                    this.setState({
                        getonedata:1,
                        items:plan,
                    })
                }else if(responseData.code == 200){

                    this.setState({
                        getonedata:2,
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dosubmit(){

        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("act",this.state.act);
        formData.append("bookid",this.state.book.reviewid);
        formData.append("schedule",JSON.stringify(this.state.items));

        var opts = {
            method:"POST",
            body:formData
        }

        fetch(newScheduleUrl,opts)
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

    addplantoschedule(what){
        if(what == 1){
            if(this.props.plan != null){
                let newItems = {};
                let selectplan = JSON.parse(this.props.plan.remaininterval);
                //let nowtimestamp = new Date().getTime();
                //alert(this.state.selectdaystring);
                let sd=new XDate(this.state.selectdaystring);
                let nowtimestamp = sd.getTime();
                //alert(nowtimestamp)
                for (let i = 0; i < selectplan.length; i++) {
                    const time = nowtimestamp + selectplan[i] * 60 * 60 * 1000;
                    const strTime = this.timeToString(time);
                    //alert(time)
                    //alert(strTime);return;
                    if (!newItems[strTime]) {
                        newItems[strTime] = [];
                        const numItems = 1;
                        for (let j = 0; j < numItems; j++) {
                            newItems[strTime].push({
                                name:this.state.book.bookname+'['+i+']',
                                time:strTime,
                                height: 50,
                                pbid:this.state.book.reviewid
                            });
                        }
                    }
                }
                this.setState({
                    items:newItems,
                    adddone:1//添加完毕
                })
            }
        }else{
            let newItems = {};
            const strTime = this.state.selectdaystring;
            newItems[strTime] = [];
            newItems[strTime].push({
                name: '从这天开始吗？点击下面的添加',
                height: 38
            });
            this.setState({
                items:newItems,
                adddone:0
            })
        }

    }

    renderselectplan() {
        if(this.state.getonedata == 2) {
            return (
                <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center', flex: 3, backgroundColor: '#FFB6C1'}}
                    onPress={() => this.selectplantoschedule()}>
                    {this.renderselectplantext()}
                </TouchableOpacity>
            )
        }
    }
    renderselectplantext(){

        if(this.props.plan == null){
            return(
                <Text style={styles.selectbuttontext} >选择路线</Text>
            )
        }else{
            return(
                <Text style={styles.selectbuttontext} >路线:{this.props.plan.name}</Text>
            )
        }
    }

    addplanfinish(){
        this.dosubmit();
    }

    renderaddandview(){
        if(this.props.plan == null){
            return;
        }
        return(
            <TouchableOpacity
                style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                onPress={() => this.addplantoschedule(1)}>
                <Text style={styles.addbuttontext} >加后预览</Text>
            </TouchableOpacity>
        )
    }


    renderaddbutton(){
        if(this.props.intype == 0){
            return ;
        }
        if(this.state.adddone == 0){
            return(
                <View style={{flexDirection:'row',height:46}}>
                    {this.renderselectplan()}
                    {this.renderaddandview()}
                </View>
            )
        }else{
            return(
                <View style={{flexDirection:'row',height:46}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:3,backgroundColor: '#FF00cc'}}
                        onPress={() => this.addplantoschedule(0)}>
                        <Text style={styles.addbuttontext} >取消添加</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                        onPress={() => this.addplanfinish()}>
                        <Text style={styles.addbuttontext} >保存</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    onWhenDayPress(day){
        if(this.props.intype == 0) {

        }else{
            if(this.state.getonedata == 2){
                if (this.state.adddone == 0) {
                    let newItems = {};
                    let ds = this.timeToString(day.timestamp);

                    //alert(ds);
                    if (newItems[ds] == null) {
                        newItems[ds] = [];
                        newItems[ds].push({
                            name: '从这天开始吗？点击下面的添加',
                            height: 38
                        });
                        this.setState({
                            items: newItems,
                            selectdaystring: ds
                        })
                    }
                }
            }

        }


    }

    renderswitch(){
        if(this.props.intype == 0){
            if(this.state.getdata == null){
                this.fetchschedule();
                return(this.renderLoading())
            }else{
                if(this.state.allcollectbooks == null){
                    return(this.rendernodata())
                }else{
                    return(this.renderAgenda())
                }
            }
        }else{
            if(this.state.getonedata == null){
                this.fetchoneschedule();
                return(this.renderLoading())
            }else{
                return(this.renderAgenda())
            }

        }
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>加载中...</Text>
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

    render(){
        return(
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderswitch()}
            </View>
        );
    }

    renderAgenda() {

        return (
            <View style={{flex:1}}>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.state.initTime}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    // monthFormat={'yyyy'}
                    //theme={{calendarBackground: 'red'}}
                    //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                    onDayPress={(day) => this.onWhenDayPress(day)}
                />
                <View style={{justifyContent: 'flex-end'}}>
                    {this.renderaddbutton()}
                </View>
            </View>
        );
    }

    loadItems(day) {

    }

    itemclick(pbid){
        if(pbid != null){
            Actions.publicbook({bookid:pbid});
        }

    }

    renderItem(item) {
        return (
        <TouchableOpacity
            onPress={() => this.itemclick(item.pbid)}>
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.name}</Text>
                <Text>{item.time}</Text>
            </View>
        </TouchableOpacity>

        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new XDate(time);
        return date.toString('yyyy-MM-dd');
    }

    nowTimeToString() {
        const date = new XDate();
        return date.toString('yyyy-MM-dd');
    }

}

Schedule.PropTypes = {
    intype:PropTypes.number,//0在设置中查看 1添加熟悉计划
    plan:PropTypes.object,
    book:PropTypes.object
};

module.exports = Schedule;