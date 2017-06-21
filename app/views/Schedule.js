/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TouchableOpacity,XDate} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
//import XDate from 'xdate';

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


        //}
        this.state = {
            items: newItems,
            initTime:this.nowTimeToString(),
            adddone:0,
            planitems:newItems,
            afteradd:newItems,
            selectdaystring:this.nowTimeToString()
        };

    }
    componentWillMount(){

    }

    selectplantoschedule(){
        Actions.reviewplan({intype:1});
    }

    addplantoschedule(what){
        if(what == 1){
            if(this.props.plan != null){
                let newItems = {};
                let selectplan = JSON.parse(this.props.plan.remaininterval);
                //let nowtimestamp = new Date().getTime();
                //alert(this.state.selectdaystring)
                let sd=new XDate(this.state.selectdaystring);
                let nowtimestamp = sd.getTime();
                for (let i = 0; i < selectplan.length; i++) {
                    const time = nowtimestamp + selectplan[i] * 60 * 60 * 1000;
                    const strTime = this.timeToString(time);
                    if (!newItems[strTime]) {
                        newItems[strTime] = [];
                        const numItems = 2;
                        for (let j = 0; j < numItems; j++) {
                            newItems[strTime].push({
                                name: 'abc Item for ' + strTime,
                                height: 50
                            });
                        }
                    }
                }
                this.setState({
                    items:newItems,
                    adddone:1
                })
            }
        }else{
            this.setState({
                items:newItems,
                adddone:0
            })
        }

    }

    renderselectplan(){

        if(this.props.plan ==null){
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

    }

    renderaddbutton(){
        if(this.props.intype == 0){
            return ;
        }
        if(this.state.adddone == 0){
            return(
                <View style={{flexDirection:'row',height:46}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:3,backgroundColor: '#FFB6C1'}}
                        onPress={() => this.selectplantoschedule()}>
                        {this.renderselectplan()}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                        onPress={() => this.addplantoschedule(1)}>
                        <Text style={styles.addbuttontext} >添加后预览</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <View style={{flexDirection:'row',height:46}}>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:3,backgroundColor: '#0066cc'}}
                        onPress={() => this.addplantoschedule(0)}>
                        <Text style={styles.addbuttontext} >取消添加</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                        onPress={() => this.addplanfinish()}>
                        <Text style={styles.addbuttontext} >确定添加</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    onWhenDayPress(day){

        let newItems = {};
        let ds = this.timeToString(day.timestamp);

        //alert(ds);
        if(newItems[ds] == null){
            newItems[ds] = [];
            newItems[ds].push({
                name: '从这天开始吗？点击下面的添加',
                height: 38
            });
            this.setState({
                items:newItems,
                selectdaystring:ds
            })
        }
    }

    render() {

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
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

    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.name}</Text>
            </View>
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
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    nowTimeToString() {
        const date = new Date();
        return date.toISOString().split('T')[0];
    }

}

Schedule.PropTypes = {
    intype:PropTypes.number,//0在设置中查看 1添加熟悉计划
    plan:PropTypes.object
};

module.exports = Schedule;