import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProductScanDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this._keyboardDidShow = () => {
            this.setState({
                keyboardShown: true,
            })
        }

        this._keyboardDidHide = () => {
            this.setState({
                keyboardShown: false,
            })
        }

        this.state = {
            detail: {},
            index: "",
            ninnum: "",
            ninnumLock: true,
            pk_cargdoc: "",
            keyboardShown: false,
        };

        this.materialConfirm = () => {
            if (this.state.ninnum.trim() === "" || this.state.pk_cargdoc.trim() === "")
                Toast.fail('需要填选的项为必输', 1);
            else {
                const { navigation } = this.props;
                navigation.navigate("产成品入库单");
                navigation.state.params.editConfirmed(this.state);
            }
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            _this.setState({
                pk_cargdoc: Event.ScanResult
            })
            if (_this.inputRef)
                _this.inputRef.focus();
        });

        let detail = this.props.navigation.state.params.item;
        let index = this.props.navigation.state.params.index;
        let pk_cargdoc = detail.pk_cargdoc ? detail.pk_cargdoc : "";
        let ninnum = detail.ninnum ? detail.ninnum : "";
        this.setState({
            detail, index, pk_cargdoc, ninnum
        })
    }

    render() {
        return (
            <Provider>
                <View style={styles.tabsContent}>
                    <ScrollView
                        style={styles.materialScrollView}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List renderHeader={'请填选'}>
                            <InputItem
                                clear
                                type="text"
                                value={this.state.pk_cargdoc}
                                placeholder="请扫码获取库位"
                                editable={false}
                                style={styles.materialInput}
                            >
                                货位
                            </InputItem>

                            <InputItem
                                clear
                                type="number"
                                value={this.state.ninnum}
                                onChange={ninnum => {
                                    if (!this.state.ninnumLock)
                                        this.setState({ ninnum });
                                }}
                                onFocus={() => {
                                    this.setState({ ninnumLock: false });
                                }}
                                onBlur={() => {
                                    this.setState({ ninnumLock: true });
                                }}
                                placeholder="请输入实际入库数量"
                                style={styles.materialInput}
                                ref={el => (this.inputRef = el)}
                            >
                                入库数量
                            </InputItem>

                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.materialConfirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                    {/* <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.materialSaveBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 暂存</Text>
                    </Button> */}
                </View>
            </Provider >
        );
    }
}

export default ProductScanDetailScreen;