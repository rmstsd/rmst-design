import './style.less'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Mask(props: MaskProps) {
  const { className, ...rest } = props

  return <div className="mask" {...rest}></div>
}
