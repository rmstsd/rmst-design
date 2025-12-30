export default function layout(props) {
  return (
    <div>
      {props.children}
      {props.modal}
    </div>
  )
}
