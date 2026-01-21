import { memo, useCallback, useEffect, useState } from 'react'

import type { Good } from './Cart'

import { CartClass } from './Cart'
import { goodData } from './goodData'
import { useUpdate } from 'ahooks'
import { cn } from '@/utils/cn'
import { Button } from 'rmst-design'

export default function Cart() {
  const [cartIns, setCartIns] = useState<CartClass>()

  const up = useUpdate()

  console.log(cartIns)

  useEffect(() => {
    setTimeout(() => {
      setCartIns(new CartClass(goodData, 5, 60))
    }, 100)
  }, [])

  const onIncrease = useCallback((item: Good) => {
    item.increase()
    up()
  }, [])
  const onDecrease = useCallback((item: Good) => {
    item.decrease()
    up()
  }, [])

  if (!cartIns) {
    return
  }

  const totalPrice = cartIns.getTotalPrice()

  return (
    <div>
      {cartIns.goods.map(item => (
        <GoodCard key={item.data.id} item={item} choose={item.choose} onIncrease={onIncrease} onDecrease={onDecrease} />
      ))}

      <footer className={cn('mt-2 p-2', cartIns.isCanDelivery() ? 'bg-green-100' : 'bg-gray-100')}>
        <div>总数量: {cartIns.getTotalChoose()}</div>
        <div>总价： {totalPrice} 元</div>
        <div>配送费: 5 元</div>
        {cartIns.isCanDelivery() ? <Button>下单</Button> : <div>还差：{cartIns.deliveryThreshold - totalPrice} 元起送</div>}
      </footer>
    </div>
  )
}

interface IProps {
  item: Good
  choose: number
  onIncrease: (item: Good) => void
  onDecrease: (item: Good) => void
}
const GoodCard = memo(
  function GoodCard(props: IProps) {
    const { item, onIncrease, onDecrease } = props

    console.log('GoodCard render', item)

    return (
      <div className="p-4 border-b">
        <div>id: {item.data.id}</div>
        <div>名字: {item.data.name}</div>
        <div>描述: {item.data.desc}</div>
        <div>价格: {item.data.price}</div>
        <div>月售: {item.data.sale}</div>
        <div>好评: {item.data.favoRAte}%</div>
        <div>
          <Button className={!item.isChoose() && 'invisible'} onClick={() => onDecrease(item)}>
            -
          </Button>
          <span className={cn('px-6', !item.isChoose() && 'invisible')}>{item.choose}</span>
          <Button onClick={() => onIncrease(item)}>+</Button>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return nextProps.choose === prevProps.choose
  }
)
