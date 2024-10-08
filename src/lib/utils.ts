import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

import { Blog } from 'contentlayer/generated'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 首字母大写
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// 格式化持续时间
export const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60

  let formattedTime = ''

  if (hours > 0) {
    formattedTime += `${hours}小时`
  }
  if (remainingMinutes > 0 || hours > 0) {
    if (formattedTime) {
      formattedTime += ' '
    }
    formattedTime += `${remainingMinutes}分钟`
  }
  if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
    if (formattedTime) {
      formattedTime += ' '
    }
    formattedTime += `${remainingSeconds}秒`
  }

  return formattedTime
}

export const sortBlogs = (blogs: Blog[]) =>
  blogs.sort((a, b) => (dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1))

export const getSystemTheme = () => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const isDark = media.matches
  const systemTheme = isDark ? 'dark' : 'light'
  return systemTheme
}
