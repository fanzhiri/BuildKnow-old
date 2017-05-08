/**
 * Created by slako on 17/2/18.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import Login from './views/Login'
import Register from './views/Register'
import Market from './views/Market'
import Follow from './views/Follow'
import Discover from './views/Discover'
import Me from './views/Me'
import MainTabbarIcon from './views/MainTabbarIcon'
import Help from './views/Help'
import Setting from './views/Setting'
import MyBookList from './views/MyBookList'

import HomePage from './views/HomePage'
import BuildQuestion from './views/BuildQuestion'
import Collect from './views/Collect'
import Statistics from './views/Statistics'
import BookCover from './views/BookCover'
import FriendList from './views/FriendList'

import ForgetPasswd from './views/ForgetPasswd'
import BookDetial from './views/BookDetial'
import AnswerQuestion from './views/AnswerQuestion'
import NewBook from './views/NewBook'
import NewOneQuestion from './views/NewOneQuestion'
import NewSomeQuestions from './views/NewSomeQuestions'
import Introduce from './views/Introduce'
import About from './views/About'
import BuildingBook from './views/BuildingBook'
import ComposeBook from './views/ComposeBook'
import PersonalCenter from './views/PersonalCenter'
import SetHeadPic from './views/SetHeadPic'
import SetHomePagePic from './views/SetHomePagePic'
import ShareManager from './views/ShareManager'
import NewShareMode from './views/NewShareMode'
import ClassCatalogue from './views/ClassCatalogue'
import ShareControl from './views/ShareControl'
import MessageList from './views/MessageList'
import NotificationList from './views/NotificationList'
import Schedule from './views/Schedule'
import FriendVerify from './views/FriendVerify'
import Complaint from './views/Complaint'
import SearchBook from './views/SearchBook'
import AnswerLib from './views/AnswerLib'
import ApplyRelease from './views/ApplyRelease'
import Admin from './views/Admin'
import ReleaseReview from './views/ReleaseReview'


import Icon from 'react-native-vector-icons/Ionicons';

export default class BuildKnow extends Component {
    render() {
        return (
            <Router>
                <Scene key="login" title="登录" component={Login}
                       type={ActionConst.RESET} duration={0} initial={true}
                       leftTitle={"注册"} onLeft={() => Actions.register()}
                       rightTitle={"找回密码"} onRight={() => Actions.forgetpasswd()}
                />
                <Scene key="register" title="注册" component={Register} duration={0} />
                <Scene key="introduce" hideNavBar component={Introduce} duration={0} />
                <Scene key="main" tabs={true} type={ActionConst.REPLACE}>
                    <Scene key="market" title="市场" component={Market} duration={0} icon={MainTabbarIcon}
                           iconName="ios-home-outline"
                           selectIconName="ios-home"
                           leftTitle  ={"分类"}  onLeft  ={() => Actions.classcatalogue()}
                           rightTitle ={"搜索"}  onRight ={() => Actions.searchbook()}
                    />
                    <Scene key="follow" title="关注" component={Follow} duration={0} icon={MainTabbarIcon}
                           iconName="ios-eye-outline"
                           selectIconName="ios-eye"/>
                    <Scene key="discover" title="发现" component={Discover} duration={0} icon={MainTabbarIcon}
                           iconName="ios-compass-outline"
                           selectIconName="ios-compass"/>
                    <Scene key="me" title="我" component={Me} duration={0} icon={MainTabbarIcon}
                           iconName="ios-body-outline"
                           selectIconName="ios-body"/>
                </Scene>
                <Scene key="setting" title="设置" component={Setting} duration={0} />
                <Scene key="help" title="帮助" component={Help} duration={0} />
                <Scene key="mybooklist" title="书架" component={MyBookList} duration={0} rightTitle={"添加"} onRight={() => Actions.newbook()}/>
                <Scene key="homepage" title="主页" component={HomePage} duration={0} />
                <Scene key="buildquestion" title="建题" component={BuildQuestion} duration={0} />
                <Scene key="collect" title="收藏" component={Collect} duration={0} />
                <Scene key="statistics" title="数据统计" component={Statistics} duration={0} />
                <Scene key="bookcover" title="书面" component={BookCover} duration={0} />
                <Scene key="buildingbook" title="题集" component={BuildingBook} duration={0} />
                <Scene key="about" title="关于" component={About} duration={0} />
                <Scene key="bookdetial" title="题本详情" component={BookDetial} duration={0} />
                <Scene key="forgetpasswd" title="忘记密码" component={ForgetPasswd} duration={0} />
                <Scene key="answerquestion" title="答题" component={AnswerQuestion} duration={0} />
                <Scene key="newbook" title="新建题本" component={NewBook} duration={0} />
                <Scene key="friendlist" title="友人" component={FriendList} duration={0} />
                <Scene key="newonequestion" title="新建单个题目" component={NewOneQuestion} duration={0} />
                <Scene key="newsomequestions" title="新建一列题目" component={NewSomeQuestions} duration={0} />
                <Scene key="composebook" title="组建题本" component={ComposeBook} duration={0} rightTitle={"添加"} onRight={() => Actions.newonequestion()}/>
                <Scene key="personalcenter" title="个人信息" component={PersonalCenter} duration={0} />
                <Scene key="setheadpic" title="上传头像" component={SetHeadPic} duration={0} />
                <Scene key="sethomepagepic" title="上传主页背景" component={SetHomePagePic} duration={0} />
                <Scene key="sharemanager" title="分享管理" component={ShareManager} duration={0} rightTitle={"添加"} onRight={() => Actions.newsharemode()}/>
                <Scene key="newsharemode" title="新建分享方式" component={NewShareMode} duration={0} />
                <Scene key="classcatalogue" title="分类目录" component={ClassCatalogue} duration={0} />
                <Scene key="sharecontrol" title="分享控制" component={ShareControl} duration={0} />
                <Scene key="messagelist" title="消息列表" component={MessageList} duration={0} />
                <Scene key="notificationlist" title="通知列表" component={NotificationList} duration={0} />
                <Scene key="schedule" title="日程" component={Schedule} duration={0} />
                <Scene key="friendverify" title="朋友验证" component={FriendVerify} duration={0} />
                <Scene key="complaint" title="投诉" component={Complaint} duration={0} />
                <Scene key="searchbook" title="搜索" component={SearchBook} duration={0} />
                <Scene key="answerlib" title="答案库" component={AnswerLib} duration={0} />
                <Scene key="applyrelease" title="申请发布" component={ApplyRelease} duration={0} />
                <Scene key="admin" title="管理事务" component={Admin} duration={0} />
                <Scene key="releasereview" title="审核发布" component={ReleaseReview} duration={0} />
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
