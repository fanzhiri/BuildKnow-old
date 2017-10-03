/**
 * Created by slako on 17/10/03.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TextInput} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class Help extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rechargebalance:"1000",//0看题 1测试

        };
    }

    balanceChange(text){
        this.setState({
            rechargebalance:text
        })
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={{height:360,margin:12,backgroundColor:"#EEEE00",borderRadius:8}}>
                    <View style={{height:80,margin:12,flexDirection:"row",borderBottomWidth:2,borderBottomColor:"#000000",alignItems:"center"}}>
                        <Text style={{fontSize:16}} >储蓄卡:</Text>
                        <Text style={{fontSize:16}} >范智日开的银行(1688)</Text>
                    </View>
                    <View style={{height:160,margin:12,borderBottomWidth:2,borderBottomColor:"#000000"}}>
                        <Text style={{fontSize:16}} >充值数:</Text>
                        <TextInput
                            style={{height:100,fontSize:36,borderColor:"#0000FF",borderWidth: 1,padding:12,marginTop:10,backgroundColor:"#FFFFFF"}}
                            onChangeText={(text) => this.balanceChange(text)}
                            value={this.state.rechargebalance}
                            placeholder={"1000"}
                            maxLength={10}
                            multiline={false}
                        />
                    </View>
                    <View style={{borderRadius:8,height:40,margin:8,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"#00FF00"}}>
                        <Text>下一步</Text>
                    </View>
                </View>
            </View>
        );
    }
}

Help.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = Help;
