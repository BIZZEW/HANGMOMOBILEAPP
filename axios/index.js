import axios from 'axios'
import { AsyncStorage } from 'react-native';
import { Toast, Portal } from '@ant-design/react-native';
// import Loading from "../fragments/common/Loading";

export default class Axios {

    static login(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then(async (data) => {
            // if (eval(data).province == "浙江") {
            await AsyncStorage.setItem('userToken', 'abc');
            _this.props.navigation.navigate('App');
            // } else
            //     Toast.fail('用户名或密码不正确', 1);
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1)
                Toast.offline('服务器繁忙，请稍后重试', 1);
            else if (String(error).toLowerCase().indexOf('network') != -1)
                Toast.offline('网络连接失败，请稍后重试', 1);
            else
                Toast.offline('服务器访问失败，请稍后重试', 1);
        })
    }

    static getUserList(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then(async (res) => {
            let data = res.data;

            _this.setState({
                orgs: data.map(function (item) {
                    return {
                        value: item.pk_corp,
                        label: item.unitname,
                    }
                }),
            });
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
        let baseApi0 = 'https://tcc.taobao.com/cc/json';
        let baseApi = 'http://10.100.6.25:80/service';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

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
                Portal.remove(key);
                if (response.status === 200) {
                    let res = response.data;
                    if (res.errorcode == 0) {
                        resolve(res);
                    } else {
                        alert(res.errormsg)
                    }
                } else {
                    reject(response.data)
                }
            }).catch((error) => {
                // Loading.hide();
                Portal.remove(key);
                reject(error);
            })
        });
    }
}