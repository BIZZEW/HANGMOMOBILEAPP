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
            searchResult: [],
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

        this.queryConfirmed = async () => {
            if (!this.state.submiting) {
                if (this.state.position && this.state.position != "") {
                    // 加载状态改为加载中
                    this.setState({ submiting: true });

                    let pk_org = await AsyncStorage.getItem('pk_org');

                    let origin = {
                        pk_corp: pk_org,
                        cscode: this.state.position,
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.queryOrder(this, "/queryonhandnum", qs.stringify(params), (res) => {
                        // 获取到的结果复制到查询结果列表
                        if (res && res.data)
                            this.setState({
                                searchResult: res.data
                            })
                    });
                } else {
                    Toast.info('请先扫货位码', 1);
                }
            } else
                Toast.info("查询中，请稍后", 1);
        }
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            Portal.remove(_this.state.scanToastKey)

            // 接收到扫码结果，将编码赋值到货位字段，同时清空其他信息字段。操作完毕之后触发查询方法
            _this.setState({
                position: Event.ScanResult,
                searchResult: [],
            }, () => _this.queryConfirmed())
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
                        <List style={{ ...styles.detailList, marginBottom: 20 }} renderHeader={'扫码结果'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.position}
                                    </Text>
                                }
                                multipleLine
                            >
                                货位编码
                                    </Item>
                        </List>

                        <List style={{ ...styles.detailList, marginBottom: 10 }} renderHeader={'查询结果'}></List>

                        <FlatList
                            style={styles.FlatList}
                            data={this.state.searchResult}
                            renderItem={({ item }) => (
                                <TouchableOpacity activeOpacity={1}>
                                    <ListItem itemInfo={item} />
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>

                    <Button
                        onPress={() => {
                            this.scanDrill()
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

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItem}>
            <Text>{`名称：${itemInfo.invname ? itemInfo.invname : ""}`}</Text>
            <Text>{`规格：${itemInfo.invspec ? itemInfo.invspec : ""}`}</Text>
            <Text>{`型号：${itemInfo.invtype ? itemInfo.invtype : ""}`}</Text>
            <Text>{`批次：${itemInfo.vbatchcode ? itemInfo.vbatchcode : ""}`}</Text>
            <Text>{`数量：${itemInfo.num ? itemInfo.num : ""}`}</Text>
        </View>
    }
}

export default PosScreen;
