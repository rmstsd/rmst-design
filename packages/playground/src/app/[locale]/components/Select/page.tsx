import { Select } from 'rmst-design'

const options2 = Array.from({ length: 8 }, (_, idx) => ({ value: `option${idx + 4}`, label: `Option ${idx + 4}` }))

export default function SelectDd() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Select size="small" options={options2} placeholder="Select"></Select>

      <Select size="default" options={options2} readOnly></Select>

      <Select size="large" options={options2} disabled></Select>
    </div>
  )
}
