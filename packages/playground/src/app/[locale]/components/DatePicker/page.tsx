import { DatePicker } from 'rmst-design'

export default function DatePickerDd() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
      <DatePicker size="small" placeholder="DatePicker" />
      <DatePicker size="small" placeholder="DatePicker timePart" timePart />

      <DatePicker size="default" placeholder="DatePicker readOnly" readOnly />

      <DatePicker size="large" placeholder="DatePicker disabled" disabled />
    </div>
  )
}
