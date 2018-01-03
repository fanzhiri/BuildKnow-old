/**
 * Created by slako on 17/12/07.
 */

import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, Image, SegmentedControlIOS, Dimensions, TouchableOpacity,ListView,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobleStyles from '../styles/GlobleStyles';
import TestingItem from '../component/TestingItem';
import DataStore from '../util/DataStore';
import Icon from 'react-native-vector-icons/Ionicons';

import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

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
        fontSize: 20,
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
        backgroundColor:'white',
        padding:12
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
    listItem:{
        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#48e8e8',

        //主轴方向
        flexDirection:'row',
    },
    bottomTextContainer: {
        flex:1,
        justifyContent: 'space-around',
        marginLeft: 10,
    },
    image: {
        width: 80,
        height: 80,
    },
    jobItem:{
        margin:8,
        padding:6,
        backgroundColor:'#EFBFF0',
        borderWidth:1,
        borderRadius:8
        //主轴方向
        //flexDirection:'row',
    },
    imagepic: {
        padding:8,
        width: window.width-16,
        height: 160,
        borderRadius:8,
    },
});

var homepagetUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=personalhp";

var followUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addfollow";

var friendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=friendchange";

var prbUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=personalreleasebooks";

var doGetHomePageBaseUrl = "https://slako.applinzi.com/api/1/homepage/";
var doGetReleaseBooksUrl = "https://slako.applinzi.com/api/1/releasebooks/";
var httpsBaseUrl = "https://slako.applinzi.com/";
var httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";
var doGetPersonBaseUrl = "https://slako.applinzi.com/api/1/person/";

let organizationPagetUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=orgpage";
let organizationJobstUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=orgjobs";

let educationtext=['不限','大专','本科','研究生','博士','博士后'];

let salarytext=['2000以下','2000 - 3000','3000 - 4500','4500 - 6000','6000 - 8000','8000 - 10000','10000 - 15000','15000 - 20000','20000 - 30000','30000 - 40000','40000 - 50000','50000 - 60000'];


class Organization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationdata:null,//组织一般性数据
            jobsdata_source:null,//所有招聘岗位数据
            homepage_releasebooks_source: null,//发布本
            selectedIndex:0,
            followhim:global.followperson.contains(this.props.userId),
            friendhim:global.friend.contains(this.props.userId),

            get_people_data:null,
        };
        this._onChange = this.onChange.bind(this);
        this._renderJobRow = this.renderJobRow.bind(this);
        this._renderPicRow = this.renderPicRow.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gorefresh == null){
            return;
        }
        this.fetchOrganization();
    }

    componentDidMount() {
        this.fetchOrganization();
        this.fetchJobs();
    }

    fetchOrganization(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("organizationid",this.props.orgid);

        let opts = {
            method:"POST",
            body:formData
        };
        fetch(organizationPagetUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    //alert(responseData.data);
                    this.setState({
                        organizationdata:responseData.data
                    })

                }else{
                    checkerrorcode(responseData);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetchJobs(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("organizationid",this.props.orgid);
        let opts = {
            method:"POST",
            body:formData
        };
        fetch(organizationJobstUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        jobsdata_source:responseData.data
                    })

                }else{
                    checkerrorcode(responseData);
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

    notFollow(){
        Alert.alert('谨慎操作', '真的要取消关注吗?', [
            {text: '是的', onPress: () => this.dofollow(0)},
            {text: '误操作'}
        ]);
    }


    renderFollowControl(){

        if(this.state.followhim){
            return(
                <TouchableOpacity  onPress={()=> this.notFollow()} >
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

    breakUp(){
        Alert.alert('谨慎操作', '真的要取消断交吗?', [
            {text: '是的', onPress: () => this.dofriend(0)},
            {text: '误操作'}
        ]);
    }

    renderFriendControl(){

        if(this.state.friendhim){
            return(
                <TouchableOpacity  onPress={()=> this.breakUp()} >
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

        if(this.state.organizationdata == null){
            return(
                <EmptyData/>
            )
        }else{
            let titleselect=['职位','题库','介绍','照片'];
            return (
                <View style={GlobleStyles.withoutTitleContainer}>
                    <ParallaxScrollView
                        stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                        parallaxHeaderHeight={240}
                        renderForeground={() => (
                            <View>
                                <View style={styles.topViewContainer}>

                                    <Text style={{fontSize:14}}>简介:{this.state.organizationdata.brief}</Text>
                                    <Text style={{fontSize:14}}>规模:{this.state.organizationdata.staffsize}</Text>
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
                        <Text style={styles.bottomButtonText} >收藏</Text>
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

    addjob(){

    }

    renderAddJobButton(){
        if(this.state.organizationdata.adminid == global.userid){
            return(
                <TouchableOpacity style={{height:24,borderRadius:6,justifyContent:"center",alignItems:"center",margin:8,backgroundColor:"#00FF00"}} onPress={()=> Actions.newjob({orgdata:this.state.organizationdata})} >
                    <Text style={styles.bottomButtonText} >添加职位</Text>
                </TouchableOpacity>
            )
        }
    }

    renderPicRow(rowData, sectionID, rowID){

        return(
            <View style={{height:160,padding:8}}>
                <Image style={styles.imagepic} resizeMode="cover" source={{uri:`${httpsPicBaseUrl}${rowData}`}} />
            </View>
        )
    }

    renderAllPicsView() {
        if(this.state.organizationdata.picsaid == ''){
            return(
                <EmptyData/>
            )
        }
        return (
            <ListView
                enableEmptySections={true}
                dataSource={DataStore.cloneWithRows(JSON.parse(this.state.organizationdata.pictures))}
                renderRow={this._renderPicRow} />
        )
    }

    renderEditPicButton(){
        if(this.state.organizationdata.adminid == global.userid){
            return(
                <TouchableOpacity style={{height:24,borderRadius:6,justifyContent:"center",alignItems:"center",margin:8,backgroundColor:"#00FF00"}} onPress={()=> Actions.editpic({orgdata:this.state.organizationdata})} >
                    <Text style={styles.bottomButtonText} >编辑照片</Text>
                </TouchableOpacity>
            )
        }
    }

    renderIntroduceView(){
        return(
            <View style={{padding:10}}>
                <Text style={{fontSize:20}}>  {this.state.organizationdata.description}</Text>
            </View>
        )
    }

    renderSegmentedView() {


        if (this.state.selectedIndex === 0) {
            return (
                <View>
                    {this.renderAddJobButton()}
                    {this.renderAllJobsView()}
                </View>
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                <EmptyData/>
            )

        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderIntroduceView()
            )
        }else if (this.state.selectedIndex === 3) {
            return (
                <View>
                    {this.renderEditPicButton()}
                    {this.renderAllPicsView()}
                </View>
            )
        }


    }

    renderJobRow(rowData, sectionID, rowID) {

        return (
            <TouchableOpacity onPress={() => Actions.jobdetail({jobid:rowData.id,jobdata:rowData})}>
                <View style={styles.jobItem}>
                    <Text style={{fontSize:18}}>{rowData.name}</Text>
                    <Text>{rowData.workplace}</Text>
                    <Text>{rowData.jobyearlow} - {rowData.jobyearhigh} 年</Text>
                    <Text>{educationtext[rowData.education]}</Text>
                    <Text>月薪：{salarytext[rowData.salary]}</Text>
                </View>
            </TouchableOpacity>
        );

    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderAllJobsView(){
        if(this.state.jobsdata_source == null){
            return(
                <EmptyData/>
            )
        }
        return (
            <ListView
                enableEmptySections={true}
                dataSource={DataStore.cloneWithRows(this.state.jobsdata_source)}
                renderRow={this._renderJobRow} />
        )
    }

    renderVipIcon(yes){
        if(yes == 1){
            return(
                <View style={{flexDirection:"row", alignItems: 'center'}}>
                    <View style={{marginLeft:4, justifyContent: 'center', alignItems: 'center', width: 18, height:18}}>
                        <Icon name="md-ribbon" size={18} color="#FF0000"/>
                    </View>
                    <Text style={{fontSize:16}}>3</Text>
                </View>

            )
        }
    }

    renderBottomText(rowData) {
        var name =rowData.bookname;
        var bookbrief =rowData.bookbrief;
        var questionsnumber =rowData.questioncount;
        var collectnum =rowData.collectnum;
        if (name) {
            return (
                <View style={styles.bottomTextContainer}>
                    <Text style={{fontSize: 20}}>{name}</Text>

                    <Text style={styles.bottomText}>简介：{bookbrief}</Text>
                    <Text style={styles.bottomText}>题数：{questionsnumber}     关注：{collectnum}</Text>
                </View>
            );
        } else {
            return null;
        }
    }

    renderReleaseRow(rowData, sectionID, rowID) {
        var reviewid =rowData.reviewid;
        var cover = rowData.cover;


        return (
            <TouchableOpacity  onPress={()=>(Actions.bookcover({bookpublicid:reviewid}))} >
                <View style={styles.listItem}>
                    <Image style={styles.image} resizeMode="cover" source={{uri:`${httpsBaseUrl}${cover}`}}/>
                    {this.renderBottomText(rowData)}
                </View>
            </TouchableOpacity>
        );

    }

    renderReleaseView(){
        return (
            <ListView
            enableEmptySections={true}
            dataSource={DataStore.cloneWithRows(this.state.homepage_releasebooks_source)}
            renderRow={this._renderReleaseRow} />
        )
    }

    renderAboutView(){
        return (
            <Text>hello</Text>
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

Organization.PropTypes = {
    orgid:PropTypes.number,
    userId: PropTypes.string.isRequired,
    peopledata:PropTypes.object,
    gorefresh: PropTypes.number,
};

Array.prototype.contains = function (element) {
    for (var i=0;i<this.length;i++){
        if(this[i]==element){
            return true;
        }
    }
    return false;
};

module.exports = Organization;