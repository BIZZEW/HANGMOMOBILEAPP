import React from 'react';
import { Image, ScrollView, AsyncStorage } from 'react-native';
// import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
import { Button, InputItem, List, WhiteSpace, WingBlank, Toast, Provider, Picker } from '@ant-design/react-native';
import axios from '../axios/index';
import qs from 'qs'
// import Loading from "../fragments/common/Loading";


class SignInScreen extends React.Component {
    static navigationOptions = {
        title: '登录',
        headerStyle: { height: 40 },
        headerTitleStyle: { fontSize: 18 },
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            orgs: [],
            org: "",
        };

        this.onOrgPress = () => {
            var origin = {
                test: "test"
            }

            var params = {
                params: JSON.stringify(origin)
            }

            axios.getUserList(this, "/queryorglist", qs.stringify(params));
        };

        this.onOrgChange = async (org) => {
            await AsyncStorage.setItem('pk_org', org[0]);
            this.setState({ org });
        };

        this._signInAsync = () => {
            var origin = {
                user_code: this.state.username,
                password: this.state.password
            }

            var params = {
                params: JSON.stringify(origin)
            }

            if (this.state.username.trim() === "" || this.state.password.trim() === "")
                Toast.fail('用户名或密码为空', 1);
            else if (this.state.org === "")
                Toast.fail('组织未选', 1);
            else
                axios.login(this, "/login", qs.stringify(params), this.state.username);
        };
    }

    render() {
        return (
            <Provider>
                <ScrollView
                    style={{ flex: 1 }}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <Image source={require('../logo.png')} style={{ width: 60, height: 60, alignSelf: "center" }} />
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <List>
                        <InputItem
                            clear
                            // error
                            value={this.state.username}
                            onChange={value => {
                                this.setState({
                                    username: value,
                                });
                            }}
                            placeholder="请输入用户名"
                        >
                            用户名
                        </InputItem>
                        <InputItem
                            clear
                            // error
                            type="password"
                            value={this.state.password}
                            onChange={value => {
                                this.setState({
                                    password: value,
                                });
                            }}
                            placeholder="请输入密码"
                        >
                            密码
                        </InputItem>
                        <Picker
                            data={this.state.orgs}
                            cols={1}
                            value={this.state.org}
                            onChange={this.onOrgChange}
                        >
                            <List.Item arrow="horizontal" onPress={this.onOrgPress}>
                                组织
                            </List.Item>
                        </Picker>
                    </List>

                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <WingBlank size="lg">
                        <WingBlank size="lg">
                            <Button
                                onPress={this._signInAsync.bind(this)}
                                type="primary"
                            >
                                登  录
                        </Button>
                        </WingBlank>
                    </WingBlank>
                </ScrollView >
            </Provider>
        );
    }
}

export default SignInScreen;