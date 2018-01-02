/**
 * Created by slako on 18/01/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem';
import {PicBaseUrl} from '../util/Attributes';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

let doGetRedPacketUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getredpacket";

class RedPacket extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redpacketdata: null,
        };
    }



    componentDidMount(){
        this.dofetchRedPacket();
    }

    dofetchRedPacket(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("redpacketid",this.props.idnumber);
        formData.append("rap",this.props.intype);
        let opts = {
            method:"POST",
            body:formData
        };
        fetch(doGetRedPacketUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        redpacketdata:responseData.data
                    });
                }else{
                    checkerrorcode(responseData);
                }
            })
            .catch((error) => {
                alert(error)
            })
    }

    renderRedPacket(){
        if(this.state.redpacketdata == null){
            return(
                <LoadingData/>
            )
        }else{
            let time_o = new Date(this.state.redpacketdata.taketime * 1000);
            let time_t = time_o.toLocaleString();
            return(
                <View>
                    <View style={{height:360,alignItems:"center",justifyContent:"center"}}>
                        <Image source={{uri:`${PicBaseUrl}${this.state.redpacketdata.head}`}} style={{width:80,height:80}}/>
                        <Text style={{fontSize:16,margin:6}}>{this.state.redpacketdata.nickname} 的红包</Text>
                        <Text style={{fontSize:20,margin:6}}>{this.state.redpacketdata.words}</Text>
                        <Text style={{fontSize:32,margin:6}}>{this.state.redpacketdata.vc} 币</Text>
                        <Text style={{fontSize:14,margin:6}}>{this.state.redpacketdata.createtime}</Text>
                        <View style={{height:36,flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFA0",margin:6,padding:6,borderRadius:6}}>
                            <Image source={{uri:`${PicBaseUrl}${this.state.redpacketdata.takeaway.head}`}} style={{width:28,height:28}}/>
                            <Text style={{fontSize:14,margin:6}}>{this.state.redpacketdata.takeaway.nickname} </Text>
                            <Text style={{fontSize:14,margin:6}}>{time_t} </Text>
                            <Text style={{fontSize:14,margin:6}}>{this.state.redpacketdata.vc} </Text>
                        </View>

                    </View>
                </View>
            )
        }
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderRedPacket()}
            </View>
        );
    }
}

RedPacket.PropTypes = {
    idnumber:PropTypes.number,
    intype:PropTypes.number, //操作形态    0查看，1抢红包
};

module.exports = RedPacket;
