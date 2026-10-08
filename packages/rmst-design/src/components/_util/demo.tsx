import { startTransition, useState, ViewTransition } from 'react'

export const Demo = function () {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() =>
          startTransition(() => {
            setOpen(!open)
          })
        }
      >
        set open
      </button>

      {open && (
        <div className="wrapper">
          <ViewTransition onEnter={instance => {}} onExit={() => {}}>
            <div className="mask"></div>
          </ViewTransition>
          <ViewTransition onEnter={instance => {}} onExit={() => {}}>
            <div className="content">content</div>
          </ViewTransition>
        </div>
      )}
    </>
  )
}
