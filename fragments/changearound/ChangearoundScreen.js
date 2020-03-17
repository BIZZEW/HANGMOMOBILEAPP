import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, AsyncStorage } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Moda, DatePicker, Toast } from '@ant-design/react-native';
const Item = List.Item;
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
        // height: 200,
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
    specialEntrance: {
        height: 40,
        position: "absolute",
        zIndex: 100,
        left: 20,
        bottom: 20,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1C86EE",
        color: "#000"
    },
    btnText: {
        color: "#fff",
        fontSize: 15,
    },
    searchBtnIcon: {
        fontSize: 20,
        // color:"#51A0EE"
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

export default class ChangearoundScreen extends React.Component {
    constructor() {
        super(...arguments);
        this.onOpenChange = isOpen => {
            /* tslint:disable: no-console */
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

            let supplierBak = this.state.supplierBak;
            this.setState({ supplier: supplierBak });
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

                    axios.requestList(this, "/querywhstr", qs.stringify(params));
                })
            }
        }

        this.state = {
            searchResult: [],
            supplier: "",
            supplierBak: "",
            formdate: "",
            enddate: "",
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "转库",
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
                                this.setState({ supplier });
                            }}
                            placeholder="请输入供应商"
                            onBlur={() => {
                                this.setState({ supplierBak: this.state.supplier })
                            }}
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
                            onPress={() => {
                                this.drawer && this.drawer.openDrawer()
                                this.setState({ supplier: this.state.supplierBak });
                            }}
                            style={styles.specialEntrance}>
                            <Text style={styles.btnText}>产成品转库</Text>
                        </Button>
                        <Button
                            onPress={() => {
                            }}
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
                            <Text style={styles.emptyHint}>可点右下角按钮查询转库单</Text>
                            <Text style={styles.emptyHint}>或左下角按钮去产成品转库</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('转库单', { item: item, requireList: this.requireList }) }}>
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
            <Text>{"出库仓库：" + itemInfo.outstorname}</Text>
            <Text>{"入库仓库：" + itemInfo.instorname}</Text>
        </View>
    }
}