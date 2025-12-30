export default function Layout(props) {
  const { children, modal } = props

  return (
    <>
      <div className="p-4 bg-slate-200">列表页 Layout</div>

      {children}
      {modal}
    </>
  )
}
