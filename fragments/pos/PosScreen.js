import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, List, Provider, Icon, InputItem, Toast, Portal } from '@ant-design/react-native';
import axios from '../../axios/index';
import styles from '../../res/styles';
import scan from '../../nativeCall/ScanModule'
import qs from 'qs';
const Item = List.Item;

class PosScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            position: "",
            num: "",
            size: "",
            batchnum: "",
            editedFlag: false,
            submiting: false,
            scanToastKey: ""
        };

        this.scanDrill = () => {
            scan.openScanner()
            let key = Toast.loading('扫码中...')
            this.setState({
                scanToastKey: key
            })
        }
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            Portal.remove(_this.state.scanToastKey)
            _this.setState({
                position: Event.ScanResult
            })
        });
    }

    componentDidMount() {
        this.scanDrill()
    }

    render() {
        return (
            <Provider>
                <View style={styles.tabsContent}>
                    <ScrollView
                        style={styles.materialScrollView}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >

                        <List style={styles.detailList} renderHeader={'货位信息'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.position}
                                    </Text>
                                }
                                multipleLine
                            >
                                货位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.num}
                                    </Text>
                                }
                                multipleLine
                            >
                                数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.size}
                                    </Text>
                                }
                                multipleLine
                            >
                                规格
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.batchnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号码
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => {
                            this.scanDrill()

                            // scan.openScanner()
                            // let key = Toast.loading('扫码中...')
                            // this.setState({
                            //     scanToastKey: key
                            // })
                        }}
                        style={{
                            ...styles.confirmBtn,
                            backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                        }}>
                        <Icon name="scan" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.detailBtnText}> 扫码查询</Text>
                    </Button>
                </View>
            </Provider>
        );
    }
}

export default PosScreen;
