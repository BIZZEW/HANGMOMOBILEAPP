import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, AsyncStorage } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal } from '@ant-design/react-native';
const Item = List.Item;
const Brief = Item.Brief;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ListItem: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        height: 200,
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

        this.onPress = () => {
            setTimeout(() => {
                this.setState({
                    data: [
                        { value: "0", label: "黑火药" },
                        { value: "1", label: "黑火药2" },
                    ],
                });
            }, 500);
        };

        this.onChange = value => {
            this.setState({ value });
        };

        this.onItemPress = value => {
            this.props.navigation.navigate('采购订单')
        }

        this.state = {
            data: [],
            value: [],
            pickerValue: [],
            searchResult: []
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "杭摩PDA / 采购入库",
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

    requireList = () => {
        this.setState({
            searchResult: [
                { key: "kkkk1" },
                { key: "kkkk2" },
                { key: "kkkk3" },
                { key: "kkkk4" },
                { key: "kkkk5" },
                { key: "kkkk6" },
            ]
        })
    }

    render() {
        const sidebar = (
            // <Provider>
            <>
                <View>
                    <List>
                        <Picker
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
                            // extra="元"
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
                            // extra="元"
                            placeholder="请输入规格"
                        >
                            规格
                        </InputItem>
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
                            <Text style={styles.emptyHint}>可点右下角按钮查询</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('采购订单') }}>
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
            <Text>{itemInfo.key}</Text>
        </View>
    }
}