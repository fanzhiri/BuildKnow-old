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

export default class BuildKnow extends Component {
    render() {
        return (
            <Router>
                <Scene key="login" title="登录" component={Login} type={ActionConst.RESET} duration={0} initial={true}/>
                <Scene key="register" title="注册" component={Register} duration={0} />
                <Scene key="introduce" hideNavBar component={Introduce} duration={0} />
                <Scene key="main" tabs={true} type={ActionConst.REPLACE}>
                    <Scene key="market" title="市场" component={Market} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="follow" title="关注" component={Follow} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="discover" title="发现" component={Discover} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="me" title="我" component={Me} duration={0} icon={MainTabbarIcon} />
                </Scene>
                <Scene key="setting" title="设置" component={Setting} duration={0} />
                <Scene key="help" title="帮助" component={Help} duration={0} />
                <Scene key="mybooklist" title="书架" component={MyBookList} duration={0} />
                <Scene key="homepage" title="主页" component={HomePage} duration={0} />
                <Scene key="buildquestion" title="建题" component={BuildQuestion} duration={0} />
                <Scene key="collect" title="收藏" component={Collect} duration={0} />
                <Scene key="statistics" title="统计" component={Statistics} duration={0} />
                <Scene key="bookcover" title="书面" component={BookCover} duration={0} />
                <Scene key="about" title="关于" component={About} duration={0} />
                <Scene key="bookdetial" title="题本详情" component={BookDetial} duration={0} />
                <Scene key="forgetpasswd" title="忘记密码" component={ForgetPasswd} duration={0} />
                <Scene key="answerquestion" title="答题" component={AnswerQuestion} duration={0} />
                <Scene key="newbook" title="新建题本" component={NewBook} duration={0} />
                <Scene key="friendlist" title="友人" component={FriendList} duration={0} />
                <Scene key="newonequestion" title="新建单个题目" component={NewOneQuestion} duration={0} />
                <Scene key="newsomequestions" title="新建一列题目" component={NewSomeQuestions} duration={0} />
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
