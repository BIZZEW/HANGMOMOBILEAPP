import axios from 'axios'
import { AsyncStorage } from 'react-native';
import { Toast, Portal } from '@ant-design/react-native';
// import Loading from "../fragments/common/Loading";

export default class Axios {

    static login(_this, url, params) {
        this.ajax({
            url,
            params,
            method: "get"
        }).then(async (data) => {
            if (eval(data).province == "浙江") {
                await AsyncStorage.setItem('userToken', 'abc');
                _this.props.navigation.navigate('App');
            } else
                Toast.fail('用户名或密码不正确', 1);
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                // alert('服务器繁忙，请稍后重试')
                Toast.offline('服务器繁忙，请稍后重试', 1);
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                // alert('服务器问失败，请稍后重试')
                Toast.offline('服务器问失败，请稍后重试', 1);
            }
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
        let baseApi = 'http://10.1.8.231:80/cusapl';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi0,
                timeout: 8000,
                params: (options.params) || "",
                data: (options.data) || "",
            }).then((response) => {
                // Loading.hide();
                Portal.remove(key);
                if (response.status === 200) {
                    let res = response.data;
                    // if (res.code === 0) {
                    resolve(res);
                    // } else {
                    //     alert(res.msg)
                    // }
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