/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
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

});

class Schedule extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <Calendar
                    // Initially visible month. Default = Date()

                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={'2017-05-10'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {console.log('selected day', day)}}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {console.log('month changed', month)}}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={false}
                    // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={false}

                    markedDates={{
                        '2017-05-16': [{startingDay: true, color: '#00B2EE'}, {endingDay: true, color: '#00B2EE'}],
                        '2017-05-17': [{startingDay: true, color: '#FF83FA'}, {endingDay: true, color: '#FF83FA'}],
                        '2017-05-24': [{startingDay: true, color: 'green'}, {endingDay: true, color: 'green'}]
                    }}
                    markingType={'interactive'}
                    />

            </View>
        );
    }
}

module.exports = Schedule;