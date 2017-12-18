/**
 * Created by slako on 17/2/18.
 */

import React, { Component ,PropTypes} from 'react';
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

import SplashScreen from 'react-native-splash-screen'
//1
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
//11
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
//21
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
//31
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
//41
import ApplyRelease from './views/ApplyRelease'
import Admin from './views/Admin'
import ReleaseReview from './views/ReleaseReview'
import BeginTest from './views/BeginTest'
import RegisterVerify from './views/RegisterVerify'
import FeedBack from './views/FeedBack'
import ReviewCheckList from './views/ReviewCheckList'
import ReviewQuestion from './views/ReviewQuestion'
import MyCollectList from './views/MyCollectList'
import ChatList from './views/ChatList'
//51
import TestResult from './views/TestResult'
import AnswerLibEdit from './views/AnswerLibEdit'
import TestCard from './views/TestCard'
//未完成
import AnswerSetting from './views/AnswerSetting';
//未完成
import PublicBook from './views/PublicBook';
//未完成
import ReviewPlan from './views/ReviewPlan';
//未完成
import NewReviewPlan from './views/NewReviewPlan';
//未完成
import NewCompetition from './views/NewCompetition';
//未完成

import Discuss from './views/Discuss';
import Comment from './views/Comment';

//61
import ChatSetting from './views/ChatSetting';
import EditChapter from './views/EditChapter';
import MyArticleList from './views/MyArticleList';
import NewArticleQst from './views/NewArticleQst';
import IqBalance from './views/IqBalance';
import MarketManage from './views/MarketManage';
import BalanceRecharge from './views/BalanceRecharge';
import AttributeChange from './views/AttributeChange';
import ServerData from './views/ServerData';
import PublishList from './views/PublishList';

//71
import UploadPic from './views/UploadPic';
import Donate from './views/Donate';
import BookList from './views/BookList';
import MemberList from './views/MemberList';
import AchievementList from './views/AchievementList';
import ChangePasswd from './views/ChangePasswd';
import AnswerLibAdd from './views/AnswerLibAdd';
import EnterpriseEnter from './views/EnterpriseEnter';
import MoreMore from './views/MoreMore';
import Organization from './views/Organization';

//81
import OrganizeList from './views/OrganizeList';
import NewJob from './views/NewJob';
import EditPic from './views/EditPic';
import UserAgreement from './views/UserAgreement';
import PrivacyPolicy from './views/PrivacyPolicy';

import Icon from 'react-native-vector-icons/Ionicons';

export default class BuildKnow extends Component {

    nothingtodo(){

    }

    endanswer(nowstatus){
        alert(nowstatus)
        if(nowstatus == 0){
            Actions.pop();
        }else{
            Actions.testresult();
        }
    }

    constructor(props) {
        super(props);
        this._timer = null;
    }

    hidesplash(){
        this._timer && clearInterval(this._timer);
        SplashScreen.hide();
    }

    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        this._timer=setInterval(()=>this.hidesplash(),1000);
        //SplashScreen.show();

    }

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
                           leftTitle  ={"分类"}  onLeft  ={() => Actions.classcatalogue({classifyid:0,title:"分类",deep:1})}
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
                <Scene key="setting"            title="设置"          component={Setting} duration={0} />
                <Scene key="help"               title="帮助"          component={Help} duration={0} />
                <Scene key="mybooklist"         title="书架"          component={MyBookList} duration={0} rightTitle={"添加"} onRight={() => Actions.newbook()}/>
                <Scene key="homepage"           title="主页"          component={HomePage} duration={0} />
                <Scene key="buildquestion"      title="建题"          component={BuildQuestion} duration={0} />
                <Scene key="collect"            title="收藏"          component={Collect} duration={0} />
                <Scene key="statistics"         title="数据统计"       component={Statistics} duration={0} />
                <Scene key="bookcover"          title="书面"          component={BookCover} duration={0} />
                <Scene key="buildingbook"       title="题集"          component={BuildingBook} duration={0} />
                <Scene key="about"              title="关于"          component={About} duration={0} />
                <Scene key="bookdetial"         title="题本详情"       component={BookDetial} duration={0} />
                <Scene key="forgetpasswd"       title="忘记密码"       component={ForgetPasswd} duration={0} />
                <Scene key="answerquestion"     title="答题"          component={AnswerQuestion} duration={0} />
                <Scene key="newbook"            title="新建题本"       component={NewBook} duration={0} />
                <Scene key="friendlist"         title="友人"          component={FriendList} duration={0} />
                <Scene key="newonequestion"     title="新建单个题目"   component={NewOneQuestion} duration={0} />
                <Scene key="newsomequestions"   title="新建题目"       component={NewSomeQuestions} duration={0} />
                <Scene key="composebook"        title="组建题本"        component={ComposeBook} duration={0} />
                <Scene key="personalcenter"     title="个人信息"        component={PersonalCenter} duration={0} />
                <Scene key="setheadpic"         title="上传头像"        component={SetHeadPic} duration={0} />
                <Scene key="sethomepagepic"     title="上传主页背景"    component={SetHomePagePic} duration={0} />
                <Scene key="sharemanager"       title="分享管理" component={ShareManager} duration={0} rightTitle={"添加"} onRight={() => Actions.newsharemode()}/>
                <Scene key="newsharemode"       title="新建分享方式" component={NewShareMode} duration={0} />
                <Scene key="classcatalogue"     title="分类目录" component={ClassCatalogue} duration={0} />
                <Scene key="sharecontrol"       title="分享控制" component={ShareControl} duration={0} />
                <Scene key="messagelist"        title="消息列表" component={MessageList} duration={0} />
                <Scene key="notificationlist"   title="通知列表" component={NotificationList} duration={0} />
                <Scene key="schedule"           title="日程" component={Schedule} duration={0} />
                <Scene key="friendverify"       title="朋友验证" component={FriendVerify} duration={0} />
                <Scene key="complaint"          title="投诉" component={Complaint} duration={0} />
                <Scene key="searchbook"         title="搜索" component={SearchBook} duration={0} />
                <Scene key="answerlib"          title="答案库" component={AnswerLib} duration={0}  rightTitle={"添加"} onRight={() => Actions.answerlibadd()}/>
                <Scene key="applyrelease"       title="申请发布" component={ApplyRelease} duration={0} />
                <Scene key="admin"              title="管理事务" component={Admin} duration={0} />
                <Scene key="releasereview"      title="审核发布" component={ReleaseReview} duration={0} />
                <Scene key="begintest"          title="准备测试" component={BeginTest} duration={0} />
                <Scene key="registerverify"     title="审核注册" component={RegisterVerify} duration={0} />
                <Scene key="feedback"           title="意见反馈" component={FeedBack} duration={0} />
                <Scene key="reviewchecklist"    title="审核表" component={ReviewCheckList} duration={0} />
                <Scene key="reviewquestion"     title="审核题目" component={ReviewQuestion} duration={0} />
                <Scene key="mycollectlist"      title="我的收藏" component={MyCollectList} duration={0} />
                <Scene key="chatlist"           title="聊天" component={ChatList} duration={0} />
                <Scene key="testresult"         title="测试结果" component={TestResult} duration={0}  />
                <Scene key="answerlibedit"      title="答案库编辑" component={AnswerLibEdit} duration={0}  />
                <Scene key="testcard"           title="题卡" component={TestCard} duration={0}  />
                <Scene key="answersetting"      title="答题设置" component={AnswerSetting} duration={0}  />
                <Scene key="publicbook"         title="出版题本" component={PublicBook} duration={0}  />
                <Scene key="reviewplan"         title="复习管理" component={ReviewPlan} duration={0} rightTitle={"添加"} onRight={() => Actions.newreviewplan({title:"新建路线",modetype:1})} />
                <Scene key="newreviewplan"      title="复习路线" component={NewReviewPlan} duration={0}  />
                <Scene key="newcompetition"     title="对战" component={NewCompetition} duration={0}  />
                <Scene key="discuss"            title="评论" component={Discuss} duration={0}  />
                <Scene key="comment"            title="发评论" component={Comment} duration={0}  />
                <Scene key="chatsetting"        title="聊天设置" component={ChatSetting} duration={0}  />
                <Scene key="editchapter"        title="章节编辑" component={EditChapter} duration={0}  />
                <Scene key="myarticlelist"      title="文章推荐" component={MyArticleList} duration={0}  rightTitle={"添加"} onRight={() => Actions.newarticleqst()}/>
                <Scene key="iqbalance"          title="智商资产" component={IqBalance} duration={0}  />
                <Scene key="newarticleqst"      title="新建文推" component={NewArticleQst} duration={0} />
                <Scene key="marketmanage"       title="上架管理" component={MarketManage} duration={0} />
                <Scene key="balancerecharge"    title="智商充值" component={BalanceRecharge} duration={0} />
                <Scene key="attributechange"    title="属性修改" component={AttributeChange} duration={0} />
                <Scene key="serverdata"         title="服务器数据" component={ServerData} duration={0} />
                <Scene key="publishlist"        title="出版列表" component={PublishList} duration={0} />
                <Scene key="uploadpic"          title="上传图片"        component={UploadPic} duration={0} />
                <Scene key="donate"             title="捐助支持"        component={Donate} duration={0} />
                <Scene key="booklist"           title="出书列表"        component={BookList} duration={0} />
                <Scene key="memberlist"         title="用户列表"        component={MemberList} duration={0} />
                <Scene key="achievementlist"    title="成就"        component={AchievementList} duration={0} />
                <Scene key="changepasswd"       title="更改密码"        component={ChangePasswd} duration={0} />
                <Scene key="answerlibadd"       title="添加答案群" component={AnswerLibAdd} duration={0} />
                <Scene key="enterpriseenter"    title="组织进驻" component={EnterpriseEnter} duration={0} />
                <Scene key="moremore"           title="更多"      component={MoreMore} duration={0} />
                <Scene key="organization"       title="组织"      component={Organization} duration={0} />
                <Scene key="organizelist"       title="组织列表"      component={OrganizeList} duration={0} rightTitle={"申添"} onRight={() => Actions.enterpriseenter()} />
                <Scene key="newjob"             title="新建职位"      component={NewJob} duration={0} />
                <Scene key="editpic"            title="编辑图片"      component={EditPic} duration={0} />
                <Scene key="useragreement"      title="用户协议"      component={UserAgreement} duration={0} />
                <Scene key="privacypolicy"      title="隐私政策"      component={PrivacyPolicy} duration={0} />
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
