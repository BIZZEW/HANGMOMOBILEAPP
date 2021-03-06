import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { Button, List, Provider, InputItem, Icon, Drawer } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProcuScanListScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.onOpenChange = isOpen => {
            if (!isOpen)
                this.setState({ editocreate: "新增" })
        };

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
            sl: "",
            slLock: true,
            hwbm: "",
            scanInfoList: [],
            keyboardShown: false,
        };

        this.addConfirmed = () => {
            if (this.state.sl.trim() != "" && this.state.hwbm.trim() != "") {
                let scanInfoList = this.state.scanInfoList;
                scanInfoList.push({
                    sl: this.state.sl + "",
                    hwbm: this.state.hwbm + "",
                    key: scanInfoList.length
                });
                this.setState({ scanInfoList });
            } else
                Toast.info('抱歉，货位或数量为空', 1);
        }

        this.editConfirmed = () => {
            if (this.state.sl.trim() != "" && this.state.hwbm.trim() != "") {
                let scanInfoList = this.state.scanInfoList;
                scanInfoList[this.state.currentEditing] = {
                    sl: this.state.sl + "",
                    hwbm: this.state.hwbm + "",
                    key: this.state.currentEditing,
                };
                this.setState({ scanInfoList });
            } else
                Toast.info('抱歉，货位或数量为空', 1);
        }

        this.addInfo = () => {
            this.sfl._reset();
            this.setState({
                editocreate: "新增",
                sl: "",
                slLock: true,
                hwbm: "",
            }, () => {
                this.drawer && this.drawer.openDrawer();
            });
        }

        this.editInfo = (item) => {
            if (item.undeletable && item.undeletable == 'Y') {
                Toast.info('抱歉，该记录已被提交或暂存，无法编辑', 1);
                this.sfl._reset();
            } else {
                this.sfl._reset();
                this.setState({
                    editocreate: "编辑",
                    ...item,
                    currentEditing: item.key
                }, () => {
                    this.drawer && this.drawer.openDrawer();
                });
            }
        }

        this.deleteInfo = (item) => {
            if (item.undeletable && item.undeletable == 'Y') {
                Toast.info('抱歉，该记录已被提交或暂存，无法删除', 1);
                this.sfl._reset();
            } else {
                this.sfl._reset();
                let scanInfoList = this.state.scanInfoList;
                scanInfoList.splice(item.key, 1);
                for (let key in scanInfoList)
                    scanInfoList[key].key = key;
                this.setState({ scanInfoList });
            }
        }

        this.scanCompleted = () => {
            // if (this.state.scanInfoList.length == 0)
            //     Toast.info('当前没有入库记录', 1);
            // else {
            const { navigation } = this.props;
            navigation.navigate("采购入库物料明细");
            navigation.state.params.scanConfirmed(this.state.scanInfoList);
            // }
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
        if (scanInfoList) {
            scanInfoList = JSON.parse(scanInfoList);
            for (let key in scanInfoList) {
                scanInfoList[key].key = key;
                scanInfoList[key].sl = scanInfoList[key].sl + "";
                scanInfoList[key].hwbm = scanInfoList[key].hwbm + "";
            }
        }
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
                            this.addConfirmed();
                        else if (this.state.editocreate == "编辑")
                            this.editConfirmed();
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
                            onPress={() => this.addInfo()}
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
                            <Text style={styles.emptyHint}>左滑条目可点击删除库位记录</Text>
                        </View>

                        <ScrollView
                            style={styles.ScrollView}
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >

                            <SwipeableFlatList
                                style={styles.FlatList}
                                data={this.state.scanInfoList}
                                itemBackgroundColor={"#1270CC"}
                                ref={el => {
                                    this.sfl = el;
                                }}
                                // keyExtractor={(item) => `${item.key}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => { this.editInfo(item) }}
                                        style={styles.swipeableFlatItem}
                                    >
                                        <ListItem itemInfo={item} />
                                    </TouchableOpacity>
                                )}
                                renderRight={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => { this.deleteInfo(item) }}
                                        style={styles.swipeableFlatRight}
                                    >
                                        <View
                                            style={styles.deleteItemBtn}
                                        >
                                            <Text
                                                style={styles.deleteItemBtnTxt}
                                            >
                                                删除
                                            </Text>
                                        </View>
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

export default ProcuScanListScreen;

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItemSp}>
            <Text>{"入库货位：" + itemInfo.hwbm}</Text>
            <Text>{"入库数量：" + itemInfo.sl}</Text>
        </View>
    }
}