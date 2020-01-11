import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image, Text, TextInput, Dimensions, ScrollView } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, InputItem, List, WhiteSpace, WingBlank } from '@ant-design/react-native';

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
            <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <Image source={require('../logo.png')} style={{ width: 150, height: 150, alignSelf: "center" }} />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <List>
                    <InputItem
                        clear
                        error
                        value={this.state.username}
                        onChange={value => {
                            this.setState({
                                username: value,
                            });
                        }}
                        // extra="元"
                        placeholder="请输入用户名"
                    >
                        用户名
                    </InputItem>
                    <InputItem
                        clear
                        error
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
                            onPress={() => {
                                this._signInAsync();
                            }}
                            type="primary"
                        >
                            登  录
                        </Button>
                    </WingBlank>
                </WingBlank>
            </ScrollView>
        );
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
}

export default SignInScreen;