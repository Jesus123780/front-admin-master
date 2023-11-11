import { useRef, useState, useMemo, useEffect } from 'react'

const dragHandler = () => {
  const elementDefaults = e => {
    e.preventDefault()
    e.stopPropagation()
  }
  // Closure Magic
  const dragCounter = () => {
    let count = 0
    const value = () => {return count}
    const increment = () => {return count++}
    const decrement = () => {return count--}
    const reset = () => {
      count = 0
      return count
    }
    return { increment, decrement, reset, value }
  }

  const dragOverCount = dragCounter()
  const draggingCount = dragCounter()

  return {
    drop: (e, callback) => {
      elementDefaults(e)
      draggingCount.reset()
      const { files } = e.dataTransfer
      if (files && Boolean(files.length)) {
        if (typeof callback === 'function') callback(files, e)
      }
    },
    dragEnter: (e, callback) => {
      elementDefaults(e)
      dragOverCount.increment()
      if (typeof callback === 'function') callback(e)
    },
    dragLeave: (e, callback) => {
      elementDefaults(e)
      if (dragOverCount.value() > 0) dragOverCount.decrement()
      if (dragOverCount.value() > 0) return
      if (typeof callback === 'function') callback(e)
    },
    dragBegin: (e, callback) => {
      elementDefaults(e)
      if (typeof callback === 'function') callback(e)
    },
    body: {
      dragEnter: (e, callback) => {
        elementDefaults(e)
        draggingCount.increment()
        if (typeof callback === 'function') callback(e)
      },
      dragLeave: (e, callback) => {
        elementDefaults(e)
        if (draggingCount.value() > 0) draggingCount.decrement()
        if (draggingCount.value() > 0) return
        if (typeof callback === 'function') callback(e)
      },
      drop: (e, callback) => {
        elementDefaults(e)
        draggingCount.reset()
        if (typeof callback === 'function') callback(e)
      }
    }
  }
}

// Dropzone Hook
const useDropzone = (
  onDrop,
  draggingStyle = { border: 'dashed grey 3px' },
  dragOverStyle = {
    border: 'dashed grey 3px'
  }
) => {
  const ref = useRef(null)
  const [cleanup, setCleanup] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const handle = useMemo(dragHandler, [])

  const eventListeners = {
    dragenter: e => {return handle.dragEnter(e, () => {
      if (!dragOver) setDragOver(true)
    })},
    dragleave: e => {return handle.dragLeave(e, () => {
      setDragOver(false)
    })},
    dragover: handle.dragBegin,
    drop: e => {return handle.drop(e, files => {
      if (typeof onDrop === 'function') onDrop(files, e)
      setDragOver(false)
      setDragging(false)
    })}
  }

  const windowListeners = {
    dragenter: e => {return handle.body.dragEnter(e, () => {
      if (!isDragging) setDragging(true)
    })},
    dragleave: e => {return handle.body.dragLeave(e, () => {
      // eslint-disable-next-line
            if (isDragging) setDragging(false)
    })},
    dragend: () => {
      // eslint-disable-next-line
        },
    drop: e => {return handle.body.drop(e, () => {
      setDragging(false)
      setDragOver(false)
    })}
  }

  useEffect(() => {
    if (ref.current) {
      const { current } = ref
      Object.keys(eventListeners).forEach(key => {return current.addEventListener(key, eventListeners[key])}
      )
      Object.keys(windowListeners).forEach(key => {return window.addEventListener(key, windowListeners[key])}
      )
      setCleanup(true)
    }

    return () => {
      if (cleanup) {
        const { current } = ref
        if (current) {
          Object.keys(eventListeners).forEach(key => {return current.removeEventListener(key, eventListeners[key])}
          )
        }
        Object.keys(windowListeners).forEach(key => {return window.removeEventListener(key, windowListeners[key])}
        )
      }
    }
  }, [ref, windowListeners, cleanup, eventListeners, isDragging, dragOver])

  const dropProps = {
    ref,
    style:
      isDragging || dragOver
        ? dragOver
          ? dragOverStyle
          : draggingStyle
        : undefined
  }
  return { isDragging, dragOver, dropProps }
}

export default useDropzone
