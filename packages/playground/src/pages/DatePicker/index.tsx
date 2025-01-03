import { DatePicker } from 'rmst-design'

export default function DatePickerDd() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <DatePicker size="small" placeholder="DatePicker" />

      <DatePicker size="default" readOnly />

      <DatePicker size="large" disabled />
    </div>
  )
}
