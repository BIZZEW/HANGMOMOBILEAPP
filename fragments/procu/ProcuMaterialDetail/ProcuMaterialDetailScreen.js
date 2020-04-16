import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProcuMaterialDetailScreen extends React.Component {
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
            // ninum: "",
            // ninumLock: true,
            cargdoc: [],
            keyboardShown: false,
            currentScanInfo: 0,
        };

        this.materialConfirm = () => {
            if (this.state.cargdoc && this.state.cargdoc.length >= 0) {
                const { navigation } = this.props;
                navigation.navigate("采购入库单");
                navigation.state.params.editConfirmed(this.state);
            }
            else
                Toast.info('请录入至少一条入库记录', 1);
        };

        this.scanConfirmed = cargdoc => {
            let currentScanInfo, ninum = 0;
            if (cargdoc) {
                currentScanInfo = cargdoc.length

                for (let i of cargdoc)
                    ninum += parseInt(i.sl);
            }

            let detail = this.state.detail;
            detail.cargdoc = cargdoc;
            detail.ninum = ninum;

            this.setState({
                detail, cargdoc, currentScanInfo
            })
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
        let detail = JSON.parse(JSON.stringify(this.props.navigation.state.params.item));
        let index = this.props.navigation.state.params.index;
        let cargdoc = detail.cargdoc || [];
        let currentScanInfo = 0;
        if (cargdoc)
            currentScanInfo = cargdoc.length
        this.setState({
            detail, index, cargdoc, currentScanInfo
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
                        <List renderHeader={'请编辑'}>
                            <Button
                                onPress={() => { this.props.navigation.navigate('采购入库记录列表', { scanInfoList: JSON.stringify(this.state.cargdoc), scanConfirmed: this.scanConfirmed }) }}
                                style={{ ...styles.scanInfoBtn }}
                            >
                                <Icon name="edit" size="sm" color="#fff" style={styles.btnIcon} />
                                <Text style={styles.btnText}>  当前 {this.state.currentScanInfo} 条入库记录</Text>
                            </Button>
                        </List>

                        <List style={styles.detailList} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.ninum}
                                    </Text>
                                }
                                multipleLine
                            >
                                数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.shen}
                                    </Text>
                                }
                                multipleLine
                            >
                                剩余数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.naccumwarehousenum}
                                    </Text>
                                }
                                multipleLine
                            >
                                累计数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料主键
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
                                        {this.state.detail.baseid_type}
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
                                主单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.narrvnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                到货数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nprice}
                                    </Text>
                                }
                                multipleLine
                            >
                                本币单价
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nmoney}
                                    </Text>
                                }
                                multipleLine
                            >
                                本币金额
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
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.materialConfirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.detailBtnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default ProcuMaterialDetailScreen;