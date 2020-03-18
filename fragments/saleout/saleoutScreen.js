import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
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
        position: "absolute",
        width: "35%",
        left: "10%",
        borderWidth: 0,
        borderColor: "#1C86EE",
        bottom: 30,
    },
    cancelSearchBtn: {
        position: "absolute",
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
            
            if (this.state.supplier.trim() === "" || this.state.formdate === "" || this.state.enddate === "")
                Toast.fail('请先填选所有查询条件再查询', 1);
            else {
                AsyncStorage.getItem('pk_org').then((org) => {
                    let origin = {
                        supplier: this.state.supplier,
                        formdate: eval(JSON.stringify(this.state.formdate)).split('T')[0],
                        enddate: eval(JSON.stringify(this.state.enddate)).split('T')[0],
                        pk_org: org,
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.requestList(this, "/querysaleout", qs.stringify(params));
                })
            }
        }

        this.state = {
            searchResult: [],
            supplier: "",
            supplierLock: true,
            formdate: "",
            enddate: "",
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "销售出库",
            headerTintColor: '#1C86EE',
        }
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

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
                    style={styles.confirmSearchBtn}
                >
                    查   询
                </Button>

                <Button
                    onPress={() => {
                        this.drawer.closeDrawer();
                    }}
                    type="primary"
                    style={styles.cancelSearchBtn}
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
                            <Text style={styles.emptyHint}>可点右下角按钮查询销售出库单</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('销售出库单', { item: item, requireList: this.requireList }) }}>
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
            <Text>{"单据号：" + itemInfo.vbillcode}</Text>
            <Text>{"单据日期：" + itemInfo.dbilldate}</Text>
            <Text>{"申请部门：" + itemInfo.cdeptid_name}</Text>
            <Text>{"申请人：" + itemInfo.cemployeeid_name}</Text>
            <Text>{"运输方式：" + itemInfo.ctransmodeid_name}</Text>
        </View>
    }
}