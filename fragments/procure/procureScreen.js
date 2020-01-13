import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon } from '@ant-design/react-native';
const Item = List.Item;
const Brief = Item.Brief;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default class procureScreen extends React.Component {
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
            this.props.navigation.navigate('详情')
        }

        this.state = {
            data: [],
            value: [],
            pickerValue: [],
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

    render() {
        const sidebar = (
            // <ScrollView style={[styles.container]}>
            <Provider>
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
            </Provider>
            // </ScrollView>
        );
        return (
            <Drawer
                sidebar={sidebar}
                position="right"
                open={false}
                drawerRef={el => (this.drawer = el)}
                onOpenChange={this.onOpenChange}
                drawerBackgroundColor="#fff"
            >
                <View style={{ flex: 1, padding: 10, backgroundColor: '#1C86EE' }}>
                    <Button onPress={() => this.drawer && this.drawer.openDrawer()} style={{ height: 35, position: "absolute", zIndex: 100, right: 20, bottom: 20, borderColor: "#1C86EE" }}><Icon name="search" size="sm" color="#1C86EE" style={{ fontSize: 20 }} /></Button>
                    <ScrollView
                        style={{ flex: 1, backgroundColor: '#f5f5f9' }}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                            <Item
                                wrap
                                extra="文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行文字超长折行"
                                multipleLine
                                align="top"
                                arrow="horizontal"
                                onPress={this.onItemPress}
                            >
                                顶部对齐
                                <Brief>辅助文字内容辅助文字内容辅助文字内容辅助文字内容</Brief>
                                <Brief>辅助文字内容</Brief>
                            </Item>
                        </List>
                    </ScrollView>
                </View>
            </Drawer >
        );
    }
}