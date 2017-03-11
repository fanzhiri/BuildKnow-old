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


const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        width:100
    },

});

const MainTabbarIcon = (props) => (
    <View style={styles.container}>
        <Text
            style={{ color: props.selected ? 'red' : 'black' ,fontSize:20}}
        >
            {props.title}
        </Text>
    </View>

);

MainTabbarIcon.propTypes = propTypes;

export default MainTabbarIcon;