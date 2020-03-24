import React from 'react';
import { Image, ScrollView, AsyncStorage } from 'react-native';
import { Button, InputItem, List, WhiteSpace, WingBlank, Toast, Provider, Picker } from '@ant-design/react-native';
import axios from '../../axios/index';
import styles from '../../res/styles';
import qs from 'qs'

class LoginScreen extends React.Component {
    static navigationOptions = {
        title: '杭摩库管',
        headerTintColor: "#1270CC",
        headerStyle: { height: 40 },
        headerTitleStyle: { fontSize: 18, color: "#1065B8", fontWeight: "bold" },
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

        this._loginAsync = () => {
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
                    style={styles.ScrollView}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <Image source={require('../../res/logo.png')} style={styles.logo} />
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <List>
                        <InputItem
                            clear
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
                                onPress={this._loginAsync.bind(this)}
                                type="primary"
                                style={styles.loginBtn}
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

export default LoginScreen;