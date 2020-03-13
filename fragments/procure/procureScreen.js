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
        width: "40%",
        marginLeft: "30%",
        marginRight: "30%",
        marginTop: 20,
        borderWidth: 0,
        borderColor: "#1C86EE"
    }
});

export default class ProcureScreen extends React.Component {
    constructor() {
        super(...arguments);
        this.onOpenChange = isOpen => {
            /* tslint:disable: no-console */
            console.log('是否打开了 Drawer', isOpen.toString());
        };

        // this.onPress = () => {
        //     setTimeout(() => {
        //         this.setState({
        //             data: [
        //                 { value: "0", label: "黑火药1" },
        //                 { value: "1", label: "黑火药2" },
        //                 { value: "2", label: "黑火药3" },
        //             ],
        //         });
        //     }, 500);
        // };

        this.onChange = value => {
            this.setState({ value });
        };

        this.onItemPress = value => {
            this.props.navigation.navigate('采购订单')
        }

        this.onFormdateChange = formdate => {
            this.setState({ formdate });
        };

        this.onEnddateChange = enddate => {
            this.setState({ enddate });
        };

        this.requireList = () => {
            if (this.state.supplier.trim() === "" || this.state.formdate === "" || this.state.enddate === "")
                Toast.fail('请先填选所有查询条件在查询', 1);
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

                    axios.requestList(this, "/queryarrive", qs.stringify(params));
                })
            }
        }

        this.state = {
            // data: [],
            // value: "",
            // pickerValue: [],
            searchResult: [],
            supplier: "",
            formdate: "",
            enddate: "",
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "采购入库",
            // headerStyle: {
            //     backgroundColor: 'black',
            // },
            headerTintColor: '#1C86EE',
            // headerTitleStyle: {
            //     fontWeight: 'bold',
            // },
        }
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

    render() {
        const sidebar = (
            // <Provider>
            <>
                <View>
                    <List>
                        {/* <Picker
                            data={this.state.data}
                            cols={1}
                            value={this.state.value}
                            onChange={this.onChange}
                        >
                            <List.Item arrow="horizontal" onPress={this.onPress}>
                                物料
                            </List.Item>
                        </Picker>
                        <InputItem
                            clear
                            error
                            value={this.state.material}
                            onChange={value => {
                                this.setState({
                                    material: value,
                                });
                            }}
                            placeholder="请输入物料编码"
                        >
                            编码
                        </InputItem>
                        <InputItem
                            clear
                            error
                            value={this.state.unit}
                            onChange={value => {
                                this.setState({
                                    unit: value,
                                });
                            }}
                            extra="元"
                            placeholder="请输入规格"
                        >
                            规格
                        </InputItem> */}


                        {/* <InputItem
                            clear
                            // error
                            value={this.state.supplier}
                            onChange={value => {
                                this.setState({
                                    supplier: value,
                                });
                            }}
                            placeholder="请输入单据编号"
                        >
                            单据编号
                        </InputItem> */}

                        <InputItem
                            clear
                            // error
                            value={this.state.supplier}
                            onChange={value => {
                                this.setState({
                                    supplier: value,
                                });
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
                    style={styles.confirmSearchBtn}
                >
                    取   消
                </Button>
            </>
            // </Provider >
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('采购订单', { item: item }) }}>
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