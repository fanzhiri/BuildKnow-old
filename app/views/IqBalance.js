/**
 * Created by slako on 17/10/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },listItem:{

        height:48,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#08e8e8',
        paddingLeft:10,
        //主轴方向
        flexDirection:'row',
        alignItems:"center"
    },

});

class IqBalance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance:1000,//0看题 1测试

        };

    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={{justifyContent:"center",alignItems:"center",height:72,backgroundColor:"#EEEE00"}}>
                    <Text style={{fontSize:32}}>{this.state.balance}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={{fontSize:14}}>最近明细</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={{fontSize:14}}>出入统计</Text>
                </View>
                {/*<TouchableOpacity onPress={() => Actions.balancerecharge()}>*/}
                    {/*<View style={styles.listItem}>*/}
                        {/*<Text style={{fontSize:14}}>充值</Text>*/}
                    {/*</View>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    }
}

IqBalance.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = IqBalance;
