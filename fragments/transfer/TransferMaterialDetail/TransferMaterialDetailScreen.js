import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, AsyncStorage, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon, SegmentedControl } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import axios from '../../../axios/index';
import qs from 'qs';

const Item = List.Item;

const styles = StyleSheet.create({
    scanBtn: {
        height: 45,
        position: "absolute",
        zIndex: 100,
        left: 20,
        bottom: 10,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1270CC",
    },
    scanSegment: {
        height: 30,
        tintColor: "#1270CC"
    },
    segmentWrapper: {
        paddingTop: 10,
        paddingHorizontal: 16,
    },
    btnText: {
        color: "#fff",
        fontSize: 20,
    },
    btnIcon: {
        marginRight: 10,
        fontSize: 15,
    },
    confirmBtn: {
        height: 45,
        zIndex: 100,
        bottom: 10,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1270CC",
    },
    detailList: {
        marginBottom: 80,
        borderRadius: 10,
    },
    tabsContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
        width: "100%",
        backgroundColor: '#1270CC',
    },
    FlatList: {
        flex: 1,
        backgroundColor: '#1270CC',
        paddingBottom: 60,
    },
    ListItem: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        padding: 20,
    },
    ScrollView: {
        flex: 1,
        backgroundColor: "#1270CC",
        width: "100%",
        paddingHorizontal: 10,
        paddingTop: 10,
    }
});

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

class TransferMaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this._keyboardDidShow = () => {
            this.setState({
                keyboardShown: true,
            })
        }

        this._keyboardDidHide = () => {
            this.setState({
                keyboardShown: false,
            })
        }

        this.state = {
            detail: {},
            index: "",
            num: "",
            numLock: true,
            incargdoc: "",
            outcargdoc: "",
            scanIndicator: true,
            showListVisible: false,
            keyboardShown: false,
        };

        this.materialConfirm = () => {
            if (this.state.num.trim() === "" || this.state.incargdoc.trim() === "" || this.state.outcargdoc.trim() === "")
                Toast.fail('需要填选的项为必输', 1);
            else {
                if (this.state.showListVisible) {
                    const { navigation } = this.props;
                    navigation.navigate("转库单");
                    navigation.state.params.editConfirmed(this.state);
                } else {
                    let origin = {
                        num: this.state.num,
                        coutcspace: this.state.outcargdoc,
                        cincspace: this.state.incargdoc,
                        dbilldate: formatTime(new Date())
                    }

                    // 产成品转库
                    AsyncStorage.multiGet(['coperatorid', 'pk_org'], (err, stores) => {
                        if (err) Toast.fail("出错了，请重试", 1);
                        else {
                            stores.map((result, i, store) => {
                                let key = store[i][0];
                                let value = store[i][1];
                                origin[key] = value;
                            });
                            origin.pk_corp = origin.pk_org;

                            let params = {
                                params: JSON.stringify(origin)
                            }

                            axios.submitOrder(this, "/prowhstr", qs.stringify(params));
                        }
                    });
                }
            }
        };

        this.onSegmentChange = e => {
            this.setState({
                scanIndicator: e.nativeEvent.selectedSegmentIndex == 0,
            })
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            if (_this.state.scanIndicator) {
                _this.setState({
                    incargdoc: Event.ScanResult
                })
            } else {
                _this.setState({
                    outcargdoc: Event.ScanResult
                })
            }
            if (_this.inputRef)
                _this.inputRef.focus();
        });

        let showListVisible = this.props.navigation.state.params.showListVisible;

        if (showListVisible) {
            let detail = this.props.navigation.state.params.item;
            let index = this.props.navigation.state.params.index;
            let incargdoc = detail.incargdoc ? detail.incargdoc : "";
            let outcargdoc = detail.outcargdoc ? detail.outcargdoc : "";
            let num = detail.num ? detail.num : "";
            this.setState({
                showListVisible, detail, index, incargdoc, outcargdoc, num
            })
        }
    }

    render() {
        return (
            <Provider>
                <View style={styles.tabsContent}>
                    <ScrollView
                        style={styles.ScrollView}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List renderHeader={'请填选'}>
                            <View style={styles.segmentWrapper}>
                                <SegmentedControl
                                    values={['扫入库货位条形码', '扫出库货位条形码']}
                                    onChange={this.onSegmentChange}
                                    onValueChange={this.onSegmentValueChange}
                                    style={styles.scanSegment}
                                />
                            </View>
                            <View
                                style={{ display: this.state.scanIndicator ? "flex" : "none" }}>
                                <InputItem
                                    clear
                                    type="text"
                                    value={this.state.incargdoc}
                                    placeholder="请扫码获取入库货位"
                                    editable={false}
                                    style={{ fontSize: 16 }}
                                >
                                    入库货位
                            </InputItem>
                            </View>

                            <View
                                style={{ display: this.state.scanIndicator ? "none" : "flex" }}>
                                <InputItem
                                    clear
                                    type="text"
                                    value={this.state.outcargdoc}
                                    placeholder="请扫码获取出库货位"
                                    editable={false}
                                    style={{ fontSize: 16 }}
                                >
                                    出库货位
                            </InputItem>
                            </View>

                            <InputItem
                                ref={el => (this.inputRef = el)}
                                clear={true}
                                type="number"
                                value={this.state.num}
                                onChange={num => {
                                    if (!this.state.numLock)
                                        this.setState({ num });
                                }}
                                onFocus={() => {
                                    this.setState({ numLock: false });
                                }}
                                onBlur={() => {
                                    this.setState({ numLock: true });
                                }}
                                placeholder="请输入实际转库数量"
                                style={{ fontSize: 16 }}
                            >
                                转库数量
                            </InputItem>
                        </List>

                        <List style={{ ...styles.detailList, display: this.state.showListVisible ? "flex" : "none" }} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.shen}
                                    </Text>
                                }
                                multipleLine
                            >
                                剩余数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nadjustnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                已调整数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_code}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料编码
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_name}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_spec}
                                    </Text>
                                }
                                multipleLine
                            >
                                规格
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.baseid_type}
                                    </Text>
                                }
                                multipleLine
                            >
                                型号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.measname}
                                    </Text>
                                }
                                multipleLine
                            >
                                单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.dshldtransnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                应转数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.crowno}
                                    </Text>
                                }
                                multipleLine
                            >
                                行号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vrownote}
                                    </Text>
                                }
                                multipleLine
                            >
                                备注
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vbatchcode}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.confirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default TransferMaterialDetailScreen;