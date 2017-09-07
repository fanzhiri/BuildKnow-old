/**
 * Created by slako on 17/2/18.
 */

import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, Image, SegmentedControlIOS, Dimensions, TouchableOpacity,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobleStyles from '../styles/GlobleStyles';
import TestingItem from '../component/TestingItem';
import DataStore from '../util/DataStore';


const window = Dimensions.get('window');
const STICKY_HEADER_HEIGHT = 32;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    segmented:{
        marginTop:6,
        marginBottom:6,
        width:240,
        alignSelf:'center'
    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#FF0000',
        fontSize: 20
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
    },
    bottomButtonViewContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        height: 32,
        alignItems: 'center',
    },
    bottomButtonText: {
        fontSize: 16,
    },
    topViewContainer:{
        height: 200,

    },
    topImgView:{
        //position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    somebutton:{
        width:32,height:24,
        backgroundColor: '#00FF7F',
        marginLeft:10
    },
});

var homepagetUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=personalhp";

var followUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addfollow";

var friendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=friendchange";

var prbUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=personalreleasebooks";

var doGetHomePageBaseUrl = "https://slako.applinzi.com/api/1/homepage/";
var doGetReleaseBooksUrl = "https://slako.applinzi.com/api/1/releasebooks/";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doGetPersonBaseUrl = "https://slako.applinzi.com/api/1/person/";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopledata:props.peopledata,
            netresult:'no',
            homepage_data_source: null,//内测本
            homepage_releasebooks_source: null,//发布本
            selectedIndex:0,
            followhim:global.followperson.contains(this.props.userId),
            friendhim:global.friend.contains(this.props.userId),

            get_people_data:null,
        };
        this._onChange = this.onChange.bind(this);
        this._renderRow = this.renderRow.bind(this);
        this._fetchHomepage = this.fetchHomepage.bind(this);

    }

    fetchHomepage(){
        const {userId} = this.props;
        let url = `${doGetHomePageBaseUrl}${userId}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        homepage_data_source:responseData.data
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

    fetchPerson(){
        const {userId} = this.props;
        let url = `${doGetPersonBaseUrl}${userId}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        peopledata:responseData.data,
                        get_people_data:0
                    })
                }else{
                    this.setState({
                        get_people_data:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetchReleaseBooks(){


        let url = `${doGetReleaseBooksUrl}${this.props.userId}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        homepage_releasebooks_source:responseData.data
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


    renderFollowControl(){

        if(this.state.followhim){
            return(
                <TouchableOpacity  onPress={()=> this.dofollow(0)} >
                    <Text style={styles.bottomButtonText} >取消关注</Text>
                </TouchableOpacity>
                )

        }else{
            return(
                <TouchableOpacity  onPress={()=> this.dofollow(1)} >
                    <Text style={styles.bottomButtonText} >关注</Text>
                </TouchableOpacity>
                )

        }

    }

    renderFriendControl(){

        if(this.state.friendhim){
            return(
                <TouchableOpacity  onPress={()=> this.dofriend(0)} >
                    <Text style={styles.bottomButtonText} >断交</Text>
                </TouchableOpacity>
            )

        }else{
            return(
                <TouchableOpacity  onPress={()=> Actions.friendverify({userId:this.props.userId})} >
                    <Text style={styles.bottomButtonText} >交友申请</Text>
                </TouchableOpacity>
            )

        }

    }

    render(){
        const {userId} = this.props;

        let titleselect ;

        if(this.state.friendhim){
            titleselect=['内测','发布','关于','详细'];
        }else{
            titleselect=['内测','发布','关于'];
        }
        if(this.state.peopledata == null){
            if(this.state.get_people_data == null){
                this.fetchPerson();
                return(
                    this.renderLoading()
                )
            }else{
                return(this.rendernodata())
            }

        }else{

            return (
                <View style={GlobleStyles.withoutTitleContainer}>
                    <ParallaxScrollView
                        headerBackgroundColor="#330000"
                        stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                        parallaxHeaderHeight={240}
                        renderForeground={() => (
                            <View>
                                <View style={styles.topViewContainer}>
                                    <Image style={styles.topImgView} source={{uri:'https://slako.applinzi.com/statics/images/question/personalhomepage/1.jpg', width: window.width, height: 200 }} >
                                        <Image source={{uri:`${httpsBaseUrl}${this.state.peopledata.head}`, width: 80, height: 80}} />
                                        <Text>昵称:{this.state.peopledata.nickname}</Text>
                                        <Text>题本数:5</Text>
                                        <Text>粉丝:20  题本： 被收藏:60</Text>

                                        <Button style={styles.somebutton} textStyle={{fontSize: 14}} onPress={()=> Actions.complaint({userId})} >投诉</Button>
                                        <Button style={styles.somebutton} textStyle={{fontSize: 14}}  >分享</Button>

                                    </Image>
                                </View>


                                <SegmentedControlIOS
                                    values={titleselect}
                                    selectedIndex={this.state.selectedIndex}
                                    style={styles.segmented}
                                    onChange={this._onChange}
                                />
                            </View>

                        )}
                        renderStickyHeader={() => (
                            <View key="sticky-header" style={styles.stickySection}>
                                {/*<Text style={styles.stickySectionText}>hello</Text>*/}
                                <SegmentedControlIOS
                                    values={titleselect}
                                    selectedIndex={this.state.selectedIndex}
                                    style={styles.segmented}
                                    onChange={this._onChange}
                                />
                            </View>

                        )}
                    >

                        {this.renderSegmentedView()}
                    </ParallaxScrollView>
                    <View style={styles.bottomButtonViewContainer}>
                        {this.renderFollowControl()}
                        <TouchableOpacity  onPress={()=> Actions.chatlist({chattoid:this.state.peopledata.userid,title:this.state.peopledata.nickname})} >
                            <Text style={styles.bottomButtonText} >私信</Text>
                        </TouchableOpacity>
                        {this.renderFriendControl()}
                        <Text style={styles.bottomButtonText} >备注</Text>
                    </View>
                </View>

            );
        }

    }

    dofriend(friend){
        const {userId} = this.props;

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("friendid",userId);
        formData.append("friend",friend);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(friendUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.friend=JSON.parse(responseData.data);
                    if(friend == 0){
                        this.setState({
                            selectedIndex:0,
                            friendhim:global.friend.contains(this.props.userId)
                        })
                    }else{
                        this.setState({
                            friendhim:global.friend.contains(this.props.userId)
                        })
                    }

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

    dofollow(follow){
        const {userId} = this.props;

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("followid",userId);
        formData.append("follow",follow);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(followUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    global.followperson=JSON.parse(responseData.data);
                    this.setState({
                        followhim:global.followperson.contains(this.props.userId)
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

    renderSegmentedView() {
        if(this.state.homepage_data_source){

            if (this.state.selectedIndex === 0) {
                return (
                    this.renderTestingView()
                )
            } else if (this.state.selectedIndex === 1) {
                if(this.state.homepage_releasebooks_source){
                    return (
                        this.renderReleaseView()
                    )
                }else{
                    this.fetchReleaseBooks();
                    return (this.renderLoading())
                }

            } else if (this.state.selectedIndex === 2) {
                return (
                    this.renderAboutView()
                )
            } else if (this.state.selectedIndex === 3) {
                return (
                    this.renderDetailView()
                )
            }

        }else{
            this._fetchHomepage();
            return (this.renderLoading())
        }

    }

    renderRow(rowData, sectionID, rowID) {
        var bookid =rowData.question_book_id;
        var cover = rowData.cover;
        var name =rowData.bookname;
        var bookbrief =rowData.bookbrief;
        var questionsnumber =rowData.q_count;
        var follow =rowData.follow;

        return (
            <TestingItem bookid={bookid}  cover={cover}
                         name={name} bookbrief={bookbrief}
                         questionsnumber={questionsnumber}
                         follow={follow}
            />
        );

    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderTestingView(){
        return (
            <ListView
                enableEmptySections={true}
                dataSource={DataStore.cloneWithRows(this.state.homepage_data_source)}
                renderRow={this._renderRow} />

        )
    }

    renderReleaseView(){
        return (
            <ListView
            enableEmptySections={true}
            dataSource={DataStore.cloneWithRows(this.state.homepage_releasebooks_source)}
            renderRow={this._renderRow} />
        )
    }

    renderAboutView(){
        return (
            <Text>History</Text>
        )
    }

    renderDetailView(){
        return (
            <Text>标签</Text>
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

HomePage.PropTypes = {
    userId: PropTypes.string.isRequired,
    peopledata:PropTypes.object,
};

Array.prototype.contains = function (element) {
    for (var i=0;i<this.length;i++){
        if(this[i]==element){
            return true;
        }
    }
    return false;
}

module.exports = HomePage;