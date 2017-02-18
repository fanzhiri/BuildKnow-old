/**
 * Created by slako on 17/2/18.
 */
import React, {
    PropTypes,
} from 'react';
import {
    Text,
} from 'react-native';

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};

const MainTabbarIcon = (props) => (
    <Text
        style={{ color: props.selected ? 'red' : 'black' }}
    >
        {props.title}
    </Text>
);

MainTabbarIcon.propTypes = propTypes;

export default MainTabbarIcon;