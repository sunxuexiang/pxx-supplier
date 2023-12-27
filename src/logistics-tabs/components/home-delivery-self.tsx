import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, Button, Form, message, Modal, Input } from 'antd';
import { Const, FindArea, AreaSelect, ValidConst } from 'qmkit';
import { fetchShippingAddress, updateShippingAddress } from '../webapi';

const { confirm } = Modal;
const FormItem = Form.Item;
const formItemLayout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 18
	}
};
const HomeDeliverySelf = (props) => {
	const { activeKey } = props;
	const [dataList, setDateList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [type, setType] = useState('add');
	const [editInfo, setEditInfo] = useState('' as any);

	const getList = async () => {
		setLoading(true);
		const { res } = await fetchShippingAddress();
		setLoading(false);
		if (res && res.code === Const.SUCCESS_CODE) {
			setDateList(res.context || []);
		} else {
			message.error(res.message || '');
		}
	}

	useEffect(() => {
		if(activeKey === '4'){
			getList();
		}
	}, [activeKey]);

	const add = () => {
		setType('add');
		setVisible(true);
	}
	const edit = (record) => {
		setEditInfo(record);
		setType('edit');
		setVisible(true);
	}
	const delConfig = async (record) => {
		const params = {
			id: record.id,
			delFlag: 1
		}
		const { res } = await updateShippingAddress(params);
		if (res && res.code === Const.SUCCESS_CODE) {
			message.success('删除成功');
			getList();
		} else {
			message.error(res.message || '');
		}
	}
	const onCancel = () => {
		setEditInfo('');
		setVisible(false);
	}
	const columns = [
		{
			title: '发货点名称',
			dataIndex: 'shippingName',
		},
		{
			title: '发货人',
			dataIndex: 'shippingPerson',
		},
		{
			title: '联系电话',
			dataIndex: 'shippingPhone',
		},
		{
			title: '发货点地址',
			dataIndex: 'detailAddress',
			render: (text, record) => {
				let address = '';
				if (record.provinceCode && record.cityCode && record.districtCode && record.streetCode) {
					address = FindArea.addressStreetInfo(
						record.provinceCode,
						record.cityCode,
						record.districtCode,
						record.streetCode
					);
				}
				return address + text;
			}
		},
		{
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			render: (text, record) => {
				return (
					<React.Fragment>
						<Button type="link" onClick={() => edit(record)}>
							编辑
						</Button>
						<Button type="link" onClick={() => delConfig(record)}>
							删除
						</Button>
					</React.Fragment>
				);
			}
		}
	]
	return (
		<div>
			<Button type="primary" style={{ marginBottom: 12 }} onClick={add}>新增发货点</Button>
			<Table
				rowKey="id"
				dataSource={dataList}
				columns={columns}
				pagination={false}
				loading={loading}
			/>
			<ShippingModalForm
				visible={visible}
				type={type}
				editInfo={editInfo}
				onCancel={onCancel}
				getList={getList}
			/>
		</div>
	)
}

export default HomeDeliverySelf;

const ShippingModal = (props) => {
	const { form, visible, type, editInfo, onCancel, getList } = props;
	const { getFieldDecorator, validateFields } = form;
	const OnOk = () => {
		validateFields(async (errs, values) => {
			if (errs) {
				return
			}
			const addressNames = FindArea.addressStreetName(
				values.address[0],
				values.address[1],
				values.address[2],
				values.address[3]
			);
			const params = {
				...values,
				provinceCode: values.address[0] || '',
				provinceName: addressNames.proviceName || '',
				cityCode: values.address[1] || '',
				cityName: addressNames.cityName || '',
				districtCode: values.address[2] || '',
				districtName: addressNames.areaName || '',
				streetCode: values.address[3] || '',
				streetName: addressNames.streetName || ''
			};
			delete params.address;
			if (type === 'edit') {
				params.id = editInfo.id;
			}
			const { res } = await updateShippingAddress(params);
			if (res && res.code === Const.SUCCESS_CODE) {
				message.success(`${type === 'add' ? '新增' : '修改'}成功`);
				onCancel();
				getList();
			} else {
				message.error(res.message || '');
			}
		})
	};
	let initAddress = [];
	if (
		type === 'edit' &&
		editInfo.provinceCode &&
		editInfo.cityCode &&
		editInfo.districtCode &&
		editInfo.streetCode
	) {
		initAddress = [
			editInfo.provinceCode.toString(),
			editInfo.cityCode.toString(),
			editInfo.districtCode.toString(),
			editInfo.streetCode.toString()
		];
	}
	console.warn(initAddress)
	return (
		<Modal
			visible={visible}
			centered
			maskClosable={false}
			width={600}
			title={type === 'add' ? '新增发货点' : '修改发货点'}
			onOk={OnOk}
			onCancel={onCancel}
			destroyOnClose
		>
			<Form {...formItemLayout}>
				<FormItem label="发货点名称">
					{getFieldDecorator('shippingName', {
						initialValue: type === 'edit' ? editInfo?.shippingName : '',
						rules: [
							{ required: true, message: '请输入发货点名称' },
							{ validator: ValidConst.validateNoPhone }
						]
					})(<Input placeholder="请输入发货点名称" />)}
				</FormItem>
				<FormItem required label="发货点地址">
					{getFieldDecorator('address', {
						initialValue: initAddress,
						rules: [
							{
								validator: (rule, value, callback) => {
									if (value && value.length === 4) {
										callback();
									} else {
										callback('请选择发货点地址');
									}
								}
							}
						]
					})(
						<AreaSelect
							placeholder="请选择发货点地址"
							getPopupContainer={() => document.getElementById('page-content')}
						/>
					)}
				</FormItem>
				<FormItem label="详细地址">
					{getFieldDecorator('detailAddress', {
						initialValue: type === 'edit' ? editInfo?.detailAddress : '',
						rules: [
							{ required: true, message: '请输入详细地址' },
							{ validator: ValidConst.validateNoPhone }
						]
					})(
						<Input
							placeholder="请输入详细地址,不超过200个字符"
							maxLength={200}
						/>
					)}
				</FormItem>
				<FormItem label="发货人">
					{getFieldDecorator('shippingPerson', {
						initialValue: type === 'edit' ? editInfo?.shippingPerson : '',
						rules: [
							{ required: true, message: '请输入发货人' },
							{ pattern: ValidConst.noNumber, message: '发货人不可填数字' }
						]
					})(<Input placeholder="请输入发货人" />)}
				</FormItem>
				<FormItem label="联系电话">
					{getFieldDecorator('shippingPhone', {
						initialValue: type === 'edit' ? editInfo?.shippingPhone : '',
						rules: [
							{ required: true, message: '请输入联系电话' },
							{
								pattern: ValidConst.phoneortele,
								message: '请输入正确的联系电话'
							}
						]
					})(<Input placeholder="请输入联系电话" />)}
				</FormItem>
			</Form>
		</Modal>
	)
};

const ShippingModalForm = Form.create<any>()(ShippingModal);