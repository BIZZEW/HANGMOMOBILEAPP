import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon } from '@ant-design/react-native';
import DialogModal from '../../common/DialogModal'
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class SaleMaterialDetailScreen extends React.Component {
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
            allItems: [],
            index: "",
            noutnum: "",
            noutnumLock: true,
            pk_checkcarg: "",
            keyboardShown: false,
            isShowDialog: false
        };

        this.materialConfirm = () => {
            if (this.state.noutnum.trim() === "" || this.state.pk_checkcarg.trim() === "")
                Toast.info('需要填选的项为必输', 1);
            else if (this.state.detail.pk_cargdoc != this.state.pk_checkcarg)
                Toast.info('货位不符，请检查扫的条形码是否正确', 3);
            else {
                const { navigation } = this.props;
                // 先将当前的数据提交到上一级界面
                navigation.state.params.editConfirmed(this.state);

                // 从当前的数据开始遍历后面的数据
                let allItems = this.state.allItems
                for (var index = this.state.index + 1; index < allItems.length; index++)
                    if (!allItems[index].pk_checkcarg) {
                        // 发现有未操作过的数据，弹出询问框，更新索引，结束遍历
                        this.setState({ isShowDialog: true, index })
                        return
                    }

                // 遍历结束也没有发现未操作过的数据，直接返回上一级界面
                navigation.navigate("销售出库单");
            }
        };

        this.ensureDialog = () => {
            // 操作下一条数据，重置页面数据
            let index = this.state.index;
            let detail = this.state.allItems[index];
            let pk_checkcarg = detail.pk_checkcarg ? detail.pk_checkcarg : "";
            let noutnum = detail.noutnum ? detail.noutnum : "";
            this.setState({
                detail, index, pk_checkcarg, noutnum, isShowDialog: false
            })
        }

        this.cancelDialog = () => {
            // 不操作下一条数据，返回上一级界面
            const { navigation } = this.props;
            navigation.navigate("销售出库单");
        }
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
                pk_checkcarg: Event.ScanResult
            })
            if (_this.inputRef)
                _this.inputRef.focus();
        });

        let detail = JSON.parse(JSON.stringify(this.props.navigation.state.params.item));
        let allItems = JSON.parse(JSON.stringify(this.props.navigation.state.params.allItems));
        let index = this.props.navigation.state.params.index;
        let pk_checkcarg = detail.pk_checkcarg ? detail.pk_checkcarg : "";
        let noutnum = detail.noutnum ? detail.noutnum : "";
        this.setState({
            detail, index, pk_checkcarg, noutnum, allItems
        })
    }

    render() {
        return (
            <Provider>
                <DialogModal
                    title={"提示"}
                    content={"当前物料已操作完成，是否继续操作下一条物料？"}
                    confirm={this.ensureDialog}
                    cancel={this.cancelDialog}
                    visible={this.state.isShowDialog}
                />
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
                                value={this.state.pk_checkcarg}
                                placeholder="请扫码获取库位"
                                editable={false}
                                // onChange={pk_checkcarg => {
                                //     this.setState({ pk_checkcarg });
                                // }}
                                style={styles.materialInput}
                            >
                                货位
                            </InputItem>

                            <InputItem
                                clear
                                type="number"
                                value={this.state.noutnum}
                                onChange={noutnum => {
                                    if (!this.state.noutnumLock)
                                        this.setState({ noutnum });
                                }}
                                onFocus={() => {
                                    this.setState({ noutnumLock: false });
                                }}
                                onBlur={() => {
                                    this.setState({ noutnumLock: true });
                                }}
                                placeholder="请输入实际出库数量"
                                style={styles.materialInput}
                                ref={el => (this.inputRef = el)}
                            >
                                出库数量
                            </InputItem>
                        </List>

                        <List style={styles.detailList} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.csname}
                                    </Text>
                                }
                                multipleLine
                            >
                                货位名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_code}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料编码
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_name}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_spec}
                                    </Text>
                                }
                                multipleLine
                            >
                                规格
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_type}
                                    </Text>
                                }
                                multipleLine
                            >
                                型号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.measname}
                                    </Text>
                                }
                                multipleLine
                            >
                                单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.crowno}
                                    </Text>
                                }
                                multipleLine
                            >
                                行号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vbatchcode}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.materialConfirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default SaleMaterialDetailScreen;