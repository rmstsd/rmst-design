import { Input } from 'rmst-design'

export default function InputDd() {
  return (
    <div className="flex flex-col items-center gap-10">
      <Input />
      <Input readOnly />
      <Input disabled />
      <Input />
      <Input />
    </div>
  )
}
