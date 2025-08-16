import { Button } from 'rmst-design'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import './style.less'
import { useEffect, useState } from 'react'

export default function ButtonDd() {
  const [scope, animate] = useAnimate()

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    console.log('eff')

    animate(scope.current, { translateX: 300 }, { duration: 1 })

    setTimeout(() => {
      animate(scope.current, { translateX: 100 }, { duration: 1 })
    }, 500)
  }, [])

  return (
    <div>
      <div ref={scope} style={{ backgroundColor: 'red', width: 100, height: 100 }}></div>

      <button onClick={() => setVisible(!visible)}>onClick</button>
      <AnimatePresence>
        {visible && (
          <motion.div
            animate="enter"
            exit="exit"
            initial="exit"
            className="bg-purple-200"
            variants={{
              exit: {
                opacity: 0,
                height: 0,
                // transition: { ease: 'easeInOut', duration: 0.3 },
                overflowY: 'hidden'
              },
              enter: {
                opacity: 1,
                height: 'auto',
                // transition: {
                //   height: { type: 'spring', bounce: 0, duration: 0.3 },
                //   opacity: { ease: 'easeInOut', duration: 0.4 }
                // },
                overflowY: 'unset'
              }
            }}
          >
            <div>电饭锅电饭锅地方</div>
            <div>电饭锅电饭锅地方</div>
            <div>电饭锅电饭锅地方</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button size="small" type="primary">
          small primary
        </Button>
        <Button size="default" type="outline">
          default outline
        </Button>
        <Button size="large" type="text">
          large text
        </Button>
      </div>

      <br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button size="small" type="primary" disabled>
          small primary
        </Button>
        <Button size="default" type="outline" disabled>
          default outline
        </Button>
        <Button size="large" type="text" disabled>
          large text
        </Button>
      </div>
    </div>
  )
}
