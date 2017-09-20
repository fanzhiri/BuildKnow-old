/**
 * Created by slako on 17/9/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headimage: {
        width: 24,
        height: 24,
    },
});

var doGetDiscussUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getdiscuss";



class Disscuss extends Component {

    constructor(props) {
        super(props);
        this.state = {
            discuss_data_source: null,
            get_disscuss_data:0,
            gorefreshing:false,
        };
        this._renderDiscussItem = this.renderDiscussItem.bind(this)
    }

    dofetch_disscuss(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetDiscussUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        discuss_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderDiscussItem(rowData, sectionID, rowID){
        let imgUri=rowData.head;
        return(
            <View>
                <View style={{height:24,flexDirection:"row",alignItems:"center"}}>
                    <Image style={styles.headimage} resizeMode="cover" source={{uri:imgUri}}></Image>
                    <Text>{rowData.nickname}</Text>
                    <View style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                        <Icon name="ios-flame" size={22} color={iconColor}/>
                    </View>
                </View>
                <View>
                    <Text>

                    </Text>
                </View>
            </View>
        )
    }

    renderDiscuss(){
        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_disscuss()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.discuss_data_source)}
                renderRow={this._renderDiscussItem}
                enableEmptySections = {true}
            />
        )
    }

    renderPage(){
        if(this.state.get_disscuss_data == 0){
            this.dofetch_disscuss();
            return (this.renderLoading());
        }else{
            if(disscuss_data_source != null){
                return(this.renderDiscuss())
            }else{
                return (this.rendernodata())
            }

        }
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderPage()}
            </View>
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
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
}

Disscuss.PropTypes = {
    intype:PropTypes.number,//0发布的书目、1未发布的书目、2题目
    idnumber:PropTypes.number,
};

module.exports = Disscuss;
