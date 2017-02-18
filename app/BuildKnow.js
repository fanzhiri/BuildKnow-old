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

export default class BuildKnow extends Component {
    render() {
        return (
            <Router>
                <Scene key="login" title="登录" component={Login} duration={0} initial={true}/>
                <Scene key="register" title="注册" component={Register} duration={0} />

                <Scene key="main" tabs={true} type={ActionConst.REPLACE}>
                    <Scene key="market" title="市场" component={Market} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="follow" title="关注" component={Follow} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="discover" title="发现" component={Discover} duration={0} icon={MainTabbarIcon}/>
                    <Scene key="me" title="我" component={Me} duration={0} icon={MainTabbarIcon}/>
                </Scene>
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
