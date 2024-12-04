import { Select } from 'rmst-design'

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

const options2 = Array.from({ length: 20 }, (_, idx) => ({ value: `option${idx + 4}`, label: `Option ${idx + 4}` }))

export default function SelectDd() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Select size="small"></Select>

      <Select size="default" options={options}></Select>

      <Select size="large" options={options2}></Select>
    </div>
  )
}
