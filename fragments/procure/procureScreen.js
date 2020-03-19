import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, AsyncStorage, Keyboard } from 'react-native';
import { Button, Drawer, List, Provider, InputItem, Icon, DatePicker, Toast } from '@ant-design/react-native';
import axios from '../../axios/index';
import qs from 'qs';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ListItem: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        padding: 20,
    },
    searchBtn: {
        height: 40,
        position: "absolute",
        zIndex: 100,
        right: 20,
        bottom: 20,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1C86EE"
    },
    searchBtnIcon: {
        fontSize: 20,
    },
    emptyIcon: {
        fontSize: 100,
        color: "#51A0EE",
    },
    emptyView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: -1,
    },
    emptyHint: {
        fontSize: 15,
        color: "#fff"
    },
    FlatList: {
        flex: 1,
        backgroundColor: '#1C86EE',
        paddingBottom: 60,
    },
    confirmSearchBtn: {
        width: "35%",
        left: "10%",
        borderWidth: 0,
        borderColor: "#1C86EE",
        bottom: 30,
    },
    cancelSearchBtn: {
        width: "35%",
        right: "10%",
        borderWidth: 0,
        borderColor: "#1C86EE",
        bottom: 30,
    },
});

export default class ProcureScreen extends React.Component {
    constructor() {
        super(...arguments);
        this.onOpenChange = isOpen => {
            console.log('是否打开了 Drawer', isOpen.toString());
        };

        this.onChange = value => {
            this.setState({ value });
        };

        this.onItemPress = value => {
            this.props.navigation.navigate('采购入库单')
        }

        this.onFormdateChange = formdate => {
            this.setState({ formdate });
        };

        this.onEnddateChange = enddate => {
            this.setState({ enddate });
        };

        this.requireList = () => {
            this.setState({
                searchResult: []
            })

            if (this.state.supplier.trim() === "" || this.state.vbillcode.trim() === "" || this.state.formdate === "" || this.state.enddate === "")
                Toast.fail('请先填选所有查询条件再查询', 1);
            else {
                AsyncStorage.getItem('pk_org').then((org) => {
                    let origin = {
                        supplier: this.state.supplier,
                        vbillcode: this.state.vbillcode,
                        formdate: eval(JSON.stringify(this.state.formdate)).split('T')[0],
                        enddate: eval(JSON.stringify(this.state.enddate)).split('T')[0],
                        pk_org: org,
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.requestList(this, "/queryarrive", qs.stringify(params));
                })
            }
        }

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
            searchResult: [],
            supplier: "",
            supplierLock: true,
            vbillcode: "",
            vbillcodeLock: true,
            formdate: "",
            enddate: "",
            keyboardShown: false,
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "采购入库",
            headerTintColor: '#1C86EE',
        }
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        const sidebar = (
            <>
                <View>
                    <List>
                        <InputItem
                            clear
                            type="text"
                            value={this.state.supplier}
                            onChange={supplier => {
                                if (!this.state.supplierLock)
                                    this.setState({ supplier });
                            }}
                            onFocus={() => {
                                this.setState({ supplierLock: false });
                            }}
                            onBlur={() => {
                                this.setState({ supplierLock: true });
                            }}
                            placeholder="请输入供应商"
                        >
                            供应商
                        </InputItem>

                        <InputItem
                            clear
                            type="text"
                            value={this.state.vbillcode}
                            onChange={vbillcode => {
                                if (!this.state.vbillcodeLock)
                                    this.setState({ vbillcode });
                            }}
                            onFocus={() => {
                                this.setState({ vbillcodeLock: false });
                            }}
                            onBlur={() => {
                                this.setState({ vbillcodeLock: true });
                            }}
                            placeholder="请输入单据号"
                        >
                            单据号
                        </InputItem>

                        <DatePicker
                            value={this.state.formdate}
                            mode="date"
                            defaultDate={new Date()}
                            minDate={new Date(2015, 7, 6)}
                            maxDate={new Date(2026, 11, 3)}
                            onChange={this.onFormdateChange}
                            format="YYYY-MM-DD"
                        >
                            <List.Item arrow="horizontal">单据日期</List.Item>
                        </DatePicker>

                        <DatePicker
                            value={this.state.enddate}
                            mode="date"
                            defaultDate={new Date()}
                            minDate={new Date(2015, 7, 6)}
                            maxDate={new Date(2026, 11, 3)}
                            onChange={this.onEnddateChange}
                            format="YYYY-MM-DD"
                        >
                            <List.Item arrow="horizontal">截止日期</List.Item>
                        </DatePicker>
                    </List>
                </View>
                <Button
                    onPress={() => {
                        this.drawer.closeDrawer();
                        this.requireList();
                    }}
                    type="primary"
                    style={{ ...styles.confirmSearchBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                >
                    查   询
                    </Button>

                <Button
                    onPress={() => {
                        this.drawer.closeDrawer();
                    }}
                    type="primary"
                    style={{ ...styles.cancelSearchBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                >
                    取   消
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
                    <View style={{ flex: 1, padding: 10, backgroundColor: '#1C86EE' }}>
                        <Button
                            onPress={() => this.drawer && this.drawer.openDrawer()}
                            style={styles.searchBtn}>
                            <Icon name="search" size="sm" color="#fff" style={styles.searchBtnIcon} />
                        </Button>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            display: (this.state.searchResult.length > 0 ? "none" : "flex"),
                        }}>
                            <Icon name="inbox" color="white" style={styles.emptyIcon} />
                            <Text style={styles.emptyHint}>可点右下角按钮查询到货单</Text>
                        </View>

                        <ScrollView
                            style={{ flex: 1 }}
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <FlatList
                                style={styles.FlatList}
                                data={this.state.searchResult}
                                renderItem={({ item }) => (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('采购入库单', { item: item, requireList: this.requireList }) }}>
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

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItem}>
            <Text>{"单据号：" + itemInfo.varrordercode}</Text>
            <Text>{"到货日期：" + itemInfo.dreceivedate}</Text>
            <Text>{"库存组织：" + itemInfo.cstoreorganization_name}</Text>
            <Text>{"业务流程：" + itemInfo.cbiztype_name}</Text>
            <Text>{"业务员：" + itemInfo.cemployeeid_name}</Text>
            <Text>{"部门：" + itemInfo.cdeptid_name}</Text>
        </View>
    }
}