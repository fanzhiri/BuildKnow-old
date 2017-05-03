/**
 * Created by slako on 17/2/18.
 */

import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, Image, SegmentedControlIOS, Dimensions, TouchableOpacity,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
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
});

var homepagetUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=personalhp";

var followUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addfollow";

var doGetHomePageBaseUrl = "https://slako.applinzi.com/api/1/homepage/";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            netresult:'no',
            homepage_data_source: null,
            selectedIndex:0
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

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        const {userId} = this.props;
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
                                    <Image source={{uri:'https://slako.applinzi.com/statics/images/question/head/boy/4.jpg', width: 80, height: 80 }} />
                                    <Text>昵称:abc</Text>
                                    <Text>题本数:5</Text>
                                    <Text>粉丝:20  题本被收藏:60</Text>
                                    <TouchableOpacity  onPress={()=> Actions.complaint({userId})} >
                                        <Text style={styles.bottomButtonText} >投诉</Text>
                                    </TouchableOpacity>
                                </Image>
                            </View>


                            <SegmentedControlIOS
                                values={['内测','发布','关于']}
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
                                values={['内测','发布','关于']}
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
                    <TouchableOpacity  onPress={()=> this.dofollow()} >
                        <Text style={styles.bottomButtonText} >关注</Text>
                    </TouchableOpacity>
                    <Text style={styles.bottomButtonText} >私信</Text>
                    <TouchableOpacity  onPress={()=> Actions.friendverify({userId})} >
                        <Text style={styles.bottomButtonText} >交友</Text>
                    </TouchableOpacity>
                    <Text style={styles.bottomButtonText} >备注</Text>
                </View>
            </View>

        );
    }



    dofollow(){
        const {userId} = this.props;

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("followid",userId);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(followUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok")
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
                return (
                    this.renderReleaseView()
                )
            } else if (this.state.selectedIndex === 2) {
                return (
                    this.renderAboutView()
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
            <Text>Discuss</Text>
        )
    }

    renderAboutView(){
        return (
            <Text>History</Text>
        )
    }
}

HomePage.PropTypes = {
    userId: PropTypes.string.isRequired,
};


module.exports = HomePage;