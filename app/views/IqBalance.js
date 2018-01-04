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

let doGetBalancePostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbalance";

class IqBalance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance:0,//
        };

    }

    componentDidMount(){
        this.dofetchBalance();
    }

    dofetchBalance(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBalancePostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.money = responseData.data.vc;
                }else{
                    checkerrorcode(responseData);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View style={{justifyContent:"center",alignItems:"center",height:120,backgroundColor:"#EEEE00"}}>
                    <Text style={{fontSize:38,margin:8}}>{global.money}</Text>
                    <TouchableOpacity onPress={() => this.dofetchBalance()}>
                        <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#7A67EE",justifyContent:"center",alignItems:"center"}}>
                            <Text>刷新一下</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => Actions.exchangedetail()}>
                    <View style={styles.listItem}>
                        <Text style={{fontSize:14}}>交易明细</Text>
                    </View>
                </TouchableOpacity>
                {/*<View style={styles.listItem}>*/}
                    {/*<Text style={{fontSize:14}}>出入统计</Text>*/}
                {/*</View>*/}
                <TouchableOpacity onPress={() => Actions.booklist({title:"做题赚币",inmode:0,whose:2})}>
                    <View style={styles.listItem}>
                        <Text style={{fontSize:14}}>做题赚币</Text>
                    </View>
                </TouchableOpacity>
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
