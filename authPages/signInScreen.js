import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image, Text, TextInput, Dimensions, ScrollView } from 'react-native';
// import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
import { Button, InputItem, List, WhiteSpace, WingBlank, Toast, Provider } from '@ant-design/react-native';
import axios from '../axios/index';
// import Loading from "../fragments/common/Loading";


class SignInScreen extends React.Component {
    static navigationOptions = {
        title: '登录',
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
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

    _signInAsync = async () => {
        if (this.state.username.trim() === "")
            Toast.fail('用户名或密码为空', 1);
        else
            axios.login(this, "/mobile_tel_segment.htm", { tel: this.state.username });
    };
}

export default SignInScreen;