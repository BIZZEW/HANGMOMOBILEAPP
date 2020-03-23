import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import styles from '../../res/styles';
_this = null;

class Loading extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            show: false
        };
    }
    static show = () => {
        _this.setState({ show: true })
    };
    static hide = () => {
        _this.setState({ show: false })
    };
    render() {
        if (this.state.show) {
            return (
                <View style={styles.LoadingPage}>
                    <View style={styles.LoadingInside}>
                        <ActivityIndicator size="large" color="#FFF" />
                        <Text style={{ marginLeft: 10, color: "#FFF", marginTop: 10 }}>正在加载...</Text>
                    </View>
                </View>
            );
        } else {
            return <View />
        }
    }
}
export default Loading;