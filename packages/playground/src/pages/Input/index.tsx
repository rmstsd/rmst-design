import { Input } from 'rmst-design'

export default function InputDd() {
  return (
    <div className="flex flex-col gap-10">
      <Input size="small" />
      <Input size="default" />
      <Input size="large" />

      <br />

      <Input readOnly value={'readOnly'} />
      <Input disabled  value={'disabled'} />
      <Input />
      <Input />
    </div>
  )
}
