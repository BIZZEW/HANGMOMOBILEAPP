import axios from 'axios'
import { AsyncStorage } from 'react-native';
import { Toast, Portal } from '@ant-design/react-native';
// import Loading from "../fragments/common/Loading";

export default class Axios {

    static login(_this, url, data, coperatorid) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then(async (res) => {
            if (res.errorcode == 0) {
                let storage = [
                    ['userToken', 'abc'],
                    ['coperatorid', coperatorid],
                ]

                AsyncStorage.multiSet(storage, e => {
                    if (e) Toast.fail("登录失败，请重试", 1);
                    else _this.props.navigation.navigate('App');
                });
            }
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1)
                Toast.offline('服务器繁忙，请稍后重试', 1);
            else if (String(error).toLowerCase().indexOf('network') != -1)
                Toast.offline('网络连接失败，请稍后重试', 1);
            else
                Toast.offline('服务器访问失败，请稍后重试', 1);
        })
    }

    static login2(_this, url, data, coperatorid) {
        let storage = [
            ['userToken', 'abc'],
        ]

        AsyncStorage.multiSet(storage, e => {
            if (e) Toast.fail("登录失败，请重试", 1);
            else _this.props.navigation.navigate('App');
        });
    }

    static getUserList(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then(async (res) => {
            if (res.errorcode == 0) {
                let data = res.data;

                _this.setState({
                    orgs: data.map(function (item) {
                        return {
                            value: item.pk_corp,
                            label: item.unitname,
                        }
                    }),
                });
            }
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1)
                Toast.offline('服务器繁忙，请稍后重试', 1);
            else if (String(error).toLowerCase().indexOf('network') != -1)
                Toast.offline('网络连接失败，请稍后重试', 1);
            else
                Toast.offline('服务器访问失败，请稍后重试', 1);
        })
    }

    static requestList(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then(async (res) => {
            if (res.errorcode == 0) {
                let data = res.data;

                if (data.length == 0)
                    Toast.info('没有查询到数据', 1)

                _this.setState({
                    searchResult: data
                })
            }
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1)
                Toast.offline('服务器繁忙，请稍后重试', 1);
            else if (String(error).toLowerCase().indexOf('network') != -1)
                Toast.offline('网络连接失败，请稍后重试', 1);
            else
                Toast.offline('服务器访问失败，请稍后重试', 1);
        })
    }

    static submitOrder(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then((res) => {
            _this.setState({ submiting: false });

            if (res.errorcode == 0) {
                if (res.checkflag && res.checkflag == "3" || res.checkflag == 3)
                    _this.continueConfirm(res.errormsg);
                else {
                    Toast.success('提交成功！', 1);

                    const { navigation } = _this.props;
                    setTimeout(() => {
                        navigation.navigate('主页');
                        navigation.state.params.requireList();
                    }, 1000);
                }
            }
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1)
                Toast.offline('服务器繁忙，请稍后重试', 1);
            else if (String(error).toLowerCase().indexOf('network') != -1)
                Toast.offline('网络连接失败，请稍后重试', 1);
            else
                Toast.offline('服务器访问失败，请稍后重试', 1);
        })
    }

    static jsonp(options) {
        new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.message);
                }
            })
        })
    }

    static ajax(options) {
        // Loading.show();
        const key = Toast.loading('加载中，请稍后...');
        let baseApi = 'http://49.4.90.227:81/service';
        let baseApi0 = 'https://tcc.taobao.com/cc/json';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';
        let baseApi2 = 'http://10.100.6.25:80/service';
        let baseApi3 = 'http://10.32.100.110:80/service';
        let baseApi4 = 'http://192.168.43.50:80/service';

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi,
                timeout: 8000,
                params: (options.params) || "",
                data: (options.data) || "",
            }).then((response) => {
                // Loading.hide();
                // alert(JSON.stringify(response));
                if (response.status === 200) {
                    let res = response.data;
                    if (res.errorcode == 0) {
                        resolve(res);
                    } else {
                        Toast.fail(res.errormsg, 3);
                        resolve(res);
                    }
                } else {
                    reject(response.data)
                }
                Portal.remove(key);
            }).catch((error) => {
                // Loading.hide();
                Portal.remove(key);
                reject(error);
            })
        });
    }
}