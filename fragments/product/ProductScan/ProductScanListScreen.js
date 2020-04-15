import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { Button, List, Provider, InputItem, Icon, Drawer } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProductScanListScreen extends React.Component {
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
            index: "",
            sl: "",
            slLock: true,
            hwbm: "",
            scanInfoList: [],
            keyboardShown: false,
        };

        this.addConfirmed = () => {
            let scanInfoList = this.state.scanInfoList;
            scanInfoList.push({
                sl: this.state.sl,
                hwbm: this.state.hwbm,
                index: scanInfoList.length
            });
            this.setState({ scanInfoList });
        }

        this.editConfirmed = () => {
            let scanInfoList = this.state.scanInfoList;
            scanInfoList[this.state.currentEditing] = {
                sl: this.state.sl,
                hwbm: this.state.hwbm,
                index: this.state.currentEditing,
            };
            this.setState({ scanInfoList });
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
            this.sfl._reset();
            this.setState({
                editocreate: "编辑",
                ...item,
                currentEditing: item.index
            }, () => {
                this.drawer && this.drawer.openDrawer();
            });
        }

        this.deleteInfo = (item) => {
            this.sfl._reset();
            let scanInfoList = this.state.scanInfoList;
            scanInfoList.splice(item.index, 1);
            for (let index in scanInfoList)
                scanInfoList[index].index = index;
            this.setState({ scanInfoList });
        }

        this.scanCompleted = () => {
            // if (this.state.scanInfoList.length == 0)
            //     Toast.fail('当前没有入库记录', 1);
            // else {
            const { navigation } = this.props;
            navigation.navigate("产成品入库物料明细");
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
            for (let index in scanInfoList)
                scanInfoList[index].index = index;
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
                            {/* <FlatList
                                style={styles.FlatList}
                                data={this.state.scanInfoList}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.editInfo(item, index) }}>
                                        <ListItem itemInfo={item} />
                                    </TouchableOpacity>
                                )}
                            /> */}

                            <SwipeableFlatList
                                style={styles.FlatList}
                                data={this.state.scanInfoList}
                                itemBackgroundColor={"#1270CC"}
                                ref={el => {
                                    this.sfl = el;
                                }}
                                // keyExtractor={(item) => `${item.index}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => { this.editInfo(item) }}
                                        style={{
                                            height: 80,
                                            backgroundColor: "#1270CC",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        <ListItem itemInfo={item} />
                                    </TouchableOpacity>
                                )}
                                renderRight={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => { this.deleteInfo(item) }}
                                        style={{
                                            height: 80,
                                            width: 80,
                                            backgroundColor: '#1270CC',
                                            paddingLeft: 8,
                                            paddingVertical: 5,
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: '#CC3333',
                                                flex: 1,
                                                justifyContent: 'center',
                                                height: 70,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: 'white',
                                                    fontSize: 16,
                                                    textAlign: 'center'
                                                }}
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

export default ProductScanListScreen;

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItemSp}>
            <Text>{"入库货位：" + itemInfo.hwbm}</Text>
            <Text>{"入库数量：" + itemInfo.sl}</Text>
        </View>
    }
}