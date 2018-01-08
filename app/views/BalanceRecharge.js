/**
 * Created by slako on 17/10/03.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,TextInput,TouchableOpacity,Alert} from "react-native";
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

let doCommitChargePostUrl = "https://slako.applinzi.com/index.php?m=question&c=admin&a=vccharge";

class BalanceRecharge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rechargebalance:1000,
            whoid:global.userid
        };
    }

    balanceChange(text){
        this.setState({
            rechargebalance:text
        })
    }

    whoidChange(text){
        this.setState({
            whoid:text
        })
    }

    docommit(){

        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("money",this.state.rechargebalance);
        formData.append("whoid",this.state.whoid);

        let opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        };
        fetch(doCommitChargePostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Alert.alert('操作提示','充值成功',[
                        {text:'ok'}
                    ]);
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error);
            })
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={{height:360,margin:12,backgroundColor:"#EEEE00",borderRadius:8}}>
                    <View style={{height:40,margin:6,flexDirection:"row",borderBottomWidth:2,borderBottomColor:"#000000",alignItems:"center"}}>
                        <Text style={{fontSize:16}} >记账卡:</Text>
                        <Text style={{fontSize:16}} >范智日开的币行(1688)</Text>
                    </View>
                    <View style={{height:80,margin:6,borderBottomWidth:2,borderBottomColor:"#000000"}}>
                        <Text style={{fontSize:16}} >充值到用户号:</Text>
                        <TextInput
                            style={{height:32,fontSize:24,borderColor:"#0000FF",borderWidth: 1,padding:6,marginTop:10,backgroundColor:"#FFFFFF"}}
                            onChangeText={(text) => this.whoidChange(text)}
                            value={this.state.whoid.toString()}
                            placeholder={"23"}
                            maxLength={10}
                            multiline={false}
                            keyboardType ={"numeric"}
                        />
                    </View>
                    <View style={{height:140,margin:6,borderBottomWidth:2,borderBottomColor:"#000000"}}>
                        <Text style={{fontSize:16}} >充值数:</Text>
                        <TextInput
                            style={{height:80,fontSize:36,borderColor:"#0000FF",borderWidth: 1,padding:12,marginTop:10,backgroundColor:"#FFFFFF"}}
                            onChangeText={(text) => this.balanceChange(text)}
                            value={this.state.rechargebalance.toString()}
                            placeholder={"1000"}
                            maxLength={10}
                            multiline={false}
                            keyboardType ={"numeric"}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.docommit()}>
                        <View style={{borderRadius:8,height:40,margin:8,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"#00FF00"}}>
                            <Text>充值</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

BalanceRecharge.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = BalanceRecharge;
