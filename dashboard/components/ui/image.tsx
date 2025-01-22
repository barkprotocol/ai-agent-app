"use client"

import type React from "react"
import { useState, useEffect } from "react"
import NextImage from "next/image"
import { cn } from "@/lib/utils"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt: string
  className?: string
  width?: number
  height?: number
}

const Image: React.FC<ImageProps> = ({ src, alt, className, width = 100, height = 100, ...props }) => {
  const [mounted, setMounted] = useState(false)
  const [imageSrc, setImageSrc] = useState(src || "/placeholder.svg")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div aria-hidden="true" style={{ width, height }} />
  }

  return (
    <NextImage
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      onError={() => setImageSrc("/placeholder.svg")}
      {...props}
    />
  )
}

export default Image

