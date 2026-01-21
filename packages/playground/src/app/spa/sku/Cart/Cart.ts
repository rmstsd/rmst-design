export interface IGood {
  id: number
  name: string
  desc: string
  price: number
  sale: number
  favoRAte: number
}

// 单个商品
export class Good {
  constructor(good: IGood) {
    this.data = good
  }

  data: IGood
  choose = 0

  increase() {
    this.choose++
  }

  decrease() {
    if (this.choose === 0) {
      return
    }
    this.choose--
  }

  isChoose() {
    return this.choose > 0
  }

  getTotalPrice() {
    return this.choose * this.data.price
  }
}

// 整个购物车, 内部管理着多个商品
export class CartClass {
  constructor(goods: IGood[], deliveryCost: number, deliveryThreshold: number) {
    this.goods = goods.map(item => new Good(item))
    this.deliveryCost = deliveryCost
    this.deliveryThreshold = deliveryThreshold
  }

  goods: Good[] = []

  deliveryCost = 0 // 配送费
  deliveryThreshold = 0 // 满xx 起送

  getTotalChoose() {
    return this.goods.reduce((acc, item) => acc + item.choose, 0)
  }

  getTotalPrice() {
    return this.goods.reduce((acc, item) => acc + item.getTotalPrice(), 0)
  }

  increase(index: number) {
    this.goods[index].increase()
  }

  decrease(index: number) {
    this.goods[index].decrease()
  }

  hasGoodsInCar() {
    return this.getTotalChoose() > 0
  }

  isCanDelivery() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }

  isChoose(index: number) {
    return this.goods[index].isChoose()
  }
}
