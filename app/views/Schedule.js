/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

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
        this.state = {
            items: {},
            initTime :this.nowTimeToString()
        };

    }
    componentWillMount(){
        if(this.props.intype == 1){
            for (let i = -1; i < 5; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const numItems = 2;
                    for (let j = 0; j < numItems; j++) {
                        this.state.items[strTime].push({
                            name: 'Item for ' + strTime,
                            height: 50
                        });
                    }
                }
            }
        }
    }

    selectplantoschedule(){
        Actions.reviewplan({intype:1});
    }

    addplantoschedule(){

    }

    renderaddbutton(){
        return(
            <View style={{flexDirection:'row',height:46}}>
                <TouchableOpacity
                    style={{justifyContent: 'center',alignItems: 'center',flex:3,backgroundColor: '#FFB6C1'}}
                    onPress={() => this.selectplantoschedule()}>
                    <Text style={styles.selectbuttontext} >选择路线</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{justifyContent: 'center',alignItems: 'center',flex:1,backgroundColor: '#0066cc'}}
                    onPress={() => this.addplantoschedule()}>
                    <Text style={styles.addbuttontext} >添加</Text>
                </TouchableOpacity>
            </View>
        )
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
                />
                <View style={{justifyContent: 'flex-end'}}>
                    {this.renderaddbutton()}
                </View>
            </View>
        );
    }

    loadItems(day) {
        setTimeout(() => {
            for (let i = -1; i < 5; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const numItems = 2;
                    for (let j = 0; j < numItems; j++) {
                        this.state.items[strTime].push({
                            name: 'Item for ' + strTime,
                            height: 50
                        });
                    }
                }
            }
            //console.log(this.state.items);
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
            this.setState({
                items: newItems
            });
        }, 1000);
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
};

module.exports = Schedule;