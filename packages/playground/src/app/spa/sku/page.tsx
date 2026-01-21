'use client'

import { useState } from 'react'

import { getAllSku } from './backTrack'
import { Button, Input } from 'rmst-design'

const attr_name_value = {
  颜色: ['黑', '白', '红'],
  尺寸: ['大', '中', '小'],
  重量: ['500g', '1kg', '5kg'],
  状态: ['a', 'b', 'c']
}

const attrs = Object.keys(attr_name_value)

function Sku() {
  const [selected, setSelected] = useState([]) // asdas

  const [data, setData] = useState([])
  console.log('data', data)

  const columns = [
    ...selected
      .map(item => item.attr)
      .map((attrItem, columnIndex) => ({
        title: attrItem,
        dataIndex: attrItem,
        render: (col, row, index) => {
          const obj = { children: col, props: { rowSpan: 1 } }

          const callBacks = (dataItem, startIdx = 0) => {
            if (columnIndex < startIdx) {
              return true
            }

            const currKey = columns[startIdx].dataIndex
            return dataItem[currKey] === row[currKey] && callBacks(dataItem, ++startIdx)
          }

          const first_idx = data.findIndex(x => callBacks(x))

          if (index === first_idx) {
            const calcSameLength = () => data.filter(x => callBacks(x)).length
            obj.props.rowSpan = calcSameLength()
          } else {
            obj.props.rowSpan = 0
          }

          return obj
        }
      })),
    { title: '销售价格', dataIndex: 'email' },
    {
      title: '市场价',
      dataIndex: 'address'
    }
  ]

  return (
    <div>
      {attrs.map(item => (
        <Button
          key={item}
          disabled={selected.some(o => o.attr === item)}
          onClick={() => {
            const _selected = selected.concat({ attr: item, values: attr_name_value[item] })
            const skus = getAllSku(_selected)

            setData(skus.map(o => ({ ...o, onlyKey: Math.random(), email: 222, address: 111 })))
            setSelected(_selected)
          }}
        >
          {item}
        </Button>
      ))}
      <hr />
      {selected.map(item => (
        <div key={item.attr} className="mt-3">
          <Input value={item.attr} className="w-[130px]" />

          <div className="mt-2 flex gap-[10px]">
            {item.values.map(o => (
              <Input key={o} value={o} className="w-[100px]" />
            ))}
          </div>
        </div>
      ))}
      <hr />
      {/* <Table columns={columns} data={data} border={{ wrapper: true, cell: true }} rowKey="onlyKey" pagination={false} /> */}
    </div>
  )
}

export default Sku
