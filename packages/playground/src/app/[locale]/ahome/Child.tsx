'use client'

import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import dynamic from 'next/dynamic'

import './child.scss'

export default function Child() {
  return <div className="p-10"></div>
}
