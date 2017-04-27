/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    ListView,Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
    rightViewStyle:{
        //主轴对齐方式
        justifyContent:'center'

    },
    leftImgStyle:{
        width:60,
        height:60,
        marginRight:15
    },
    topTitleStyle:{
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:48
    }
});

var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class Follow extends Component {


    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,

        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);
        this._doOnPress = this.doOnPress.bind(this);

    }

    peoplelist(){
        let formData = new FormData();
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(peoplelistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        people_list_data_source:responseData.data
                    })
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['个人','组织','公司']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>
        );
    }
    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {

            if(this.state.people_list_data_source){

                return (this.renderIntroduceView())
            }else{
                this._peoplelist();
                return (this.renderLoading())
            }

        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderLoading()
            )
        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderLoading()
            )
        }
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    doOnPress(userid){
        Actions.homepage({userid});
    }

    renderPeople(people){
        var userId = (people.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${people.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {people.username}
                        </Text>
                        <Text >
                            {people.userid}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderIntroduceView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.people_list_data_source)}
                renderRow={(rowData) => this._renderPeople(rowData)}
                enableEmptySections = {true}
            />
        )
    }


}

module.exports = Follow;