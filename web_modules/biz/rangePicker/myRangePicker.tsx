import React from 'react';
import { DatePicker } from 'antd';
import './index.less';

const { RangePicker } = DatePicker;

type rangePorps = {
	title: string;
	getCalendarContainer?: Function;
	value?: Array<any>,
	onChange?: Function
}

class MyRangePicker extends React.Component{
	props: {
		title: string;
		getCalendarContainer?: Function;
		value?: Array<any>,
		onChange?: Function
	}

	render() {
		const { title, getCalendarContainer, value, onChange } = this.props;
		return (
			<React.Fragment>
			<span className='my-rangePicker-title'>{title}</span>
			<RangePicker
				className='my-rangePicker'
				getCalendarContainer={() => getCalendarContainer()}
				value={value}
				onChange={e => onChange(e)}
			/>
		</React.Fragment>
		)
	}
}

export default MyRangePicker;