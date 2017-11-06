/**
 * Created by fanzhiri on 2017/2/27.
 */
import React, {Component, PropTypes} from 'react';
import {Actions} from "react-native-router-flux";
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
        borderRadius:20
    },
    bottomTextContainer: {
        width: 80,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {

        fontSize: 16,
        justifyContent: 'center',
    },
    bottomImage: {
        height: 20,
        width: 80
    },
    mkitem:{
        marginRight:8,
        marginLeft:8,
        height: 100,
    }
});

var httpsBaseUrl = "https://slako.applinzi.com/";

class MarketListItem extends Component {
    constructor() {
        super();
        this.renderBottomText = this.renderBottomText.bind(this);
    }

    render() {
        const {rowID, cover} = this.props;
        return (
            <TouchableOpacity rowID={rowID}  onPress={()=>(Actions.bookcover({bookpublicid:this.props.book.bookid}))} >
                <View style={styles.mkitem}>
                    <Image style={[styles.image, this.props.imageStyle]} resizeMode="cover" source={{uri:`${httpsBaseUrl}${cover}`}} />
                    {this.renderBottomText()}
                </View>
            </TouchableOpacity>
        );
    }

    renderBottomText() {
        return (
            <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>{this.props.bookname}</Text>
                {/*<Image resizeMode="cover" style={styles.bottomImage} source={require('../image/score_line.png')}/>*/}
            </View>
        );
    }
}

MarketListItem.PropTypes = {
    rowID: PropTypes.number,
    bookname: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    book:PropTypes.object,

};

export default MarketListItem;