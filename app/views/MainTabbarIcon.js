/**
 * Created by slako on 17/2/18.
 */
import React, {
    PropTypes,
} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
    iconName: PropTypes.string,
    selectIconName: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFED',
        //flexDirection:'row',
        width:120
    },

});

const MainTabbarIcon = (props) => (
    <View style={styles.container}>
        <Icon style={{textAlign: 'center', marginRight: 0}} name={props.selected ? props.selectIconName : props.iconName} size={28} color={props.selected ? "#FF1493" : "black"}/>

        <Text
            style={{ color: props.selected ? '#000FFF' : 'black' ,fontSize:12}}
        >
            {props.title}
        </Text>
    </View>

);

MainTabbarIcon.propTypes = propTypes;

export default MainTabbarIcon;