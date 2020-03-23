import React, { Component } from "react";
import { AppRegistry, View } from 'react-native';
import styles from '../../res/styles';
import Loading from './Loading';
import Popup from './Popup';

const originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = (appKey, component) => {
    return originRegister(appKey, function () {
        const OriginAppComponent = component();
        return class extends Component {
            render() {
                return (
                    <View style={styles.rootContainer}>
                        <OriginAppComponent />
                        {/* 弹窗 */}
                        <Popup />
                        {/* 提示 */}
                        {/* <Toast /> */}
                        {/* //加载动画 */}
                        <Loading></Loading>
                    </View>
                );
            };
        };
    });
};