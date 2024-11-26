import { Trigger } from '../Trigger'

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DatePicker(props: DatePickerProps) {
  const content = <div>DatePicker</div>

  return (
    <Trigger popup={content}>
      <div
        onClick={() => {
          console.log('div click')
        }}
      >
        <input type="text" />
      </div>
    </Trigger>
  )
}
