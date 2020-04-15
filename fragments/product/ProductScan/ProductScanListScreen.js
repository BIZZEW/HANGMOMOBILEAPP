import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, List, Provider, InputItem, Icon, Drawer } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProductScanListScreen extends React.Component {
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
            // detail: {},
            editocreate: "新增",
            index: "",
            sl: "",
            slLock: true,
            hwbm: "",
            scanInfoList: [],
            keyboardShown: false,
        };

        this.addScanInfo = () => {
            let scanInfoList = this.state.scanInfoList;
            scanInfoList.push({
                sl: this.state.sl,
                hwbm: this.state.hwbm
            });
            this.setState({ scanInfoList });
        }

        this.editScanInfo = () => {
            let scanInfoList = this.state.scanInfoList;
            scanInfoList[this.state.currentEditing] = {
                sl: this.state.sl,
                hwbm: this.state.hwbm
            };
            this.setState({ scanInfoList });
        }

        this.editInfo = (item, index) => {
            this.setState({ ...item, editocreate: "编辑", currentEditing: index }, () => {
                this.drawer.openDrawer()
            });
        }

        this.scanCompleted = () => {
            if (this.state.scanInfoList.length == 0)
                Toast.fail('当前没有入库记录', 1);
            else {
                const { navigation } = this.props;
                navigation.navigate("产成品入库物料明细");
                navigation.state.params.scanConfirmed(this.state.scanInfoList);
            }
        };
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
            _this.setState({
                hwbm: Event.ScanResult
            })
            if (_this.inputRef)
                _this.inputRef.focus();
        });

        let scanInfoList = this.props.navigation.state.params.scanInfoList;
        if (scanInfoList)
            scanInfoList = JSON.parse(scanInfoList);
        // alert(scanInfoList);
        this.setState({ scanInfoList })
    }

    render() {
        const sidebar = (
            <>
                <View>
                    <List renderHeader={this.state.editocreate}>
                        <InputItem
                            clear
                            type="text"
                            value={this.state.hwbm}
                            placeholder="请扫码获取库位"
                            editable={false}
                            style={styles.materialInput}
                        >
                            货位
                            </InputItem>

                        <InputItem
                            clear
                            type="number"
                            value={this.state.sl}
                            onChange={sl => {
                                if (!this.state.slLock)
                                    this.setState({ sl });
                            }}
                            onFocus={() => {
                                this.setState({ slLock: false });
                            }}
                            onBlur={() => {
                                this.setState({ slLock: true });
                            }}
                            placeholder="请输入实际入库数量"
                            style={styles.materialInput}
                            ref={el => (this.inputRef = el)}
                        >
                            入库数量
                            </InputItem>
                    </List>
                </View>

                <Button
                    onPress={() => {
                        this.drawer.closeDrawer();
                        if (this.state.editocreate == "新增")
                            this.addScanInfo();
                        else if (this.state.editocreate == "编辑")
                            this.editScanInfo();
                    }}
                    type="primary"
                    style={{ ...styles.confirmSearchBtnCtr, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                >
                    确   定
                </Button>
            </>
        );
        return (
            <Provider>
                <Drawer
                    sidebar={sidebar}
                    position="right"
                    open={false}
                    drawerRef={el => (this.drawer = el)}
                    onOpenChange={this.onOpenChange}
                    drawerBackgroundColor="#fff"
                >
                    <View style={styles.searchWrapper}>
                        <Button
                            onPress={() => {
                                this.drawer && this.drawer.openDrawer();
                                this.setState({
                                    editocreate: "新增",
                                    sl: "",
                                    slLock: true,
                                    hwbm: "",
                                });
                            }}
                            style={styles.searchBtn}>
                            <Icon name="plus" size="sm" color="#fff" style={styles.searchBtnIcon} />
                        </Button>
                        <Button
                            onPress={() => this.scanCompleted()}
                            style={styles.specialEntrance}>
                            <Text style={styles.btnText}>确认</Text>
                        </Button>
                        <View style={{
                            ...styles.emptyView,
                            display: (this.state.scanInfoList.length > 0 ? "none" : "flex"),
                        }}>
                            <Icon name="inbox" color="white" style={styles.emptyIcon} />
                            <Text style={styles.emptyHint}>可点右下角按钮新增库位记录</Text>
                            <Text style={styles.emptyHint}>或点左下角按钮确认库位记录</Text>
                        </View>

                        <ScrollView
                            style={styles.ScrollView}
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <FlatList
                                style={styles.FlatList}
                                data={this.state.scanInfoList}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.editInfo(item, index) }}>
                                        <ListItem itemInfo={item} />
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>

                    </View>
                </Drawer >
            </Provider>
        );
    }
}

export default ProductScanListScreen;

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItem}>
            <Text>{"入库货位：" + itemInfo.hwbm}</Text>
            <Text>{"入库数量：" + itemInfo.sl}</Text>
        </View>
    }
}