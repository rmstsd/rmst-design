export default function Layout(props) {
  return (
    <div>
      {props.banner}
      <div>navbar</div>

      {props.children}
    </div>
  )
}
